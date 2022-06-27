using LaylaERP.BAL;
using LaylaERP.Models;
using LaylaERP.UTILITIES;
using Newtonsoft.Json;
using RestSharp.Serialization;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;

namespace LaylaERP.Controllers
{
    public class ShipController : Controller
    {
        // GET: ShipStation
        //public ActionResult ShipStation()
        //{
        //    return View();
        //}
        public ActionResult ShipStation()
        {
            string str = string.Empty;
            try
            {
                string action = string.Empty, start_date = string.Empty, end_date = string.Empty;
                if (Request.QueryString["action"] != null)
                    action = Request.QueryString["action"].ToString();
                if (Request.QueryString["start_date"] != null)
                {
                    start_date = Request.QueryString["start_date"].ToString();
                    //start_date = start_date.Split('/')[1] + "/" + start_date.Split('/')[0] + "/" + start_date.Split('/')[2];
                }
                if (Request.QueryString["end_date"] != null)
                {
                    end_date = Request.QueryString["end_date"].ToString();
                    //end_date = end_date.Split('/')[1] + "/" + end_date.Split('/')[0] + "/" + end_date.Split('/')[2];
                }
                //DAL.SQLHelper.ExecuteNonQueryWithTrans("insert into db_log select getdate(),'" + action + "'");
                if (action == "export")
                {
                    DateTime s_date = DateTime.Today, e_date = DateTime.Today;
                    if (!string.IsNullOrEmpty(start_date))
                        s_date = Convert.ToDateTime(start_date);
                    if (!string.IsNullOrEmpty(end_date))
                        e_date = Convert.ToDateTime(end_date);
                    str += "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
                    str += "<Orders pages=\"1\">";
                    DataTable dt = ShipRepository.ProcessingOrders(s_date, e_date);
                    int qty = 0; long var_id = 0, prod_id = 0; decimal order_price = 0, price = 0;
                    foreach (DataRow DR in dt.Rows)
                    {
                        order_price = 0;
                        str += "<Order>";
                        str += "<OrderID><![CDATA[" + DR["order_name"].ToString().Replace("#", "") + "]]></OrderID>";
                        str += "<OrderNumber><![CDATA[" + DR["order_name"].ToString().Replace("#", "") + "]]></OrderNumber>";
                        if (DR["post_date_gmt"] != DBNull.Value)
                            str += "<OrderDate>" + Convert.ToDateTime(DR["post_date_gmt"].ToString()).ToString("MM/dd/yyyy HH:mm") + "</OrderDate>";
                        else
                            str += "<OrderDate></OrderDate>";
                        //str += "<OrderDate>'.gmdate("m / d / Y H: i", strtotime($each_order->post_date) - $tz_offset).'</OrderDate>";
                        str += "<OrderStatus><![CDATA[processing]]></OrderStatus>";
                        if (DR["post_modified_gmt"] != DBNull.Value)
                            str += "<LastModified>" + Convert.ToDateTime(DR["post_modified_gmt"].ToString()).ToString("MM/dd/yyyy HH:mm") + "</LastModified>";
                        else
                            str += "<LastModified></LastModified>";
                        //str += "<LastModified>'.gmdate("m / d / Y H: i", strtotime($each_order->post_modified) - $tz_offset).'</LastModified>";
                        //str += "<ShippingMethod><![CDATA[USPSPriorityMail]]></ShippingMethod>";
                        str += "<PaymentMethod><![CDATA[" + DR["pm_title"].ToString() + "]]></PaymentMethod>";
                        str += "<CustomerNotes><![CDATA[" + "" + "]]></CustomerNotes>";
                        //str += "<CustomerNotes><![CDATA['.strip_tags($order->customer_note).']]></CustomerNotes>'; 
                        str += "<InternalNotes><![CDATA[" + "" + "]]></InternalNotes>";
                        //str += "<InternalNotes><![CDATA['.substr(strip_tags(implode(" | ", $order_notes)), 0, 1000).']]></InternalNotes>'; 
                        str += "<Customer>";
                        str += "<CustomerCode><![CDATA[" + DR["b_email"].ToString() + "]]></CustomerCode>";
                        str += "<BillTo>";
                        str += "<Name><![CDATA[" + DR["b_fn"].ToString() + " " + DR["b_ln"].ToString() + "]]></Name>";
                        str += "<Company><![CDATA[" + DR["b_com"].ToString() + "]]></Company>";
                        str += "<Phone><![CDATA[" + DR["b_phone"].ToString() + "]]></Phone>";
                        str += "<Email><![CDATA[" + DR["b_email"].ToString() + "]]></Email>";
                        str += "</BillTo>";
                        str += "<ShipTo>";
                        str += "<Name><![CDATA[" + DR["s_fn"].ToString() + " " + DR["s_ln"].ToString() + "]]></Name>";
                        str += "<Company><![CDATA[" + DR["s_com"].ToString() + "]]></Company>";
                        str += "<Address1><![CDATA[" + DR["s_add1"].ToString() + "]]></Address1>";
                        str += "<Address2><![CDATA[" + DR["s_add2"].ToString() + "]]></Address2>";
                        str += "<City><![CDATA[" + DR["s_city"].ToString() + "]]></City>";
                        str += "<State><![CDATA[" + DR["s_state"].ToString() + "]]></State>";
                        str += "<PostalCode><![CDATA[" + DR["s_postcode"].ToString() + "]]></PostalCode>";
                        if (!string.IsNullOrEmpty(DR["s_country"].ToString()))
                        {
                            str += "<Country><![CDATA[" + DR["s_country"].ToString() + "]]></Country>";
                        }
                        else
                        {
                            str += "<Country><![CDATA[US]]></Country>";
                        }
                        str += "<Phone><![CDATA[" + DR["b_phone"].ToString() + "]]></Phone>";
                        str += "</ShipTo>";
                        str += "</Customer>";
                        if (DR["order_name"].ToString().EndsWith(" - FMF") || DR["order_name"].ToString().EndsWith("-FMF"))
                            str += "<RequestedWarehouse>RSL</RequestedWarehouse>";
                        if (DR["order_name"].ToString().EndsWith(" - PRO") || DR["order_name"].ToString().EndsWith("-PRO"))
                            str += "<ShippingMethod>Mattress Protector - FedEx One Rate Pak</ShippingMethod>";

                        str += "<Items>";
                        DataTable dtitems = ShipRepository.ProcessingOrdersItemsDetails(DR["ID"].ToString(), DR["split_detail_id"].ToString());
                        foreach (DataRow DR_item in dtitems.Rows)
                        {
                            if (DR_item["product_id"] != DBNull.Value && !string.IsNullOrEmpty(DR_item["product_id"].ToString()))
                                prod_id = Convert.ToInt32(DR_item["product_id"].ToString());
                            else
                                prod_id = 0;
                            if (DR_item["variation_id"] != DBNull.Value && !string.IsNullOrEmpty(DR_item["variation_id"].ToString()))
                                var_id = Convert.ToInt32(DR_item["variation_id"].ToString());
                            else
                                var_id = 0;
                            if (DR_item["qty"] != DBNull.Value && !string.IsNullOrEmpty(DR_item["qty"].ToString()))
                                qty = Convert.ToInt32(DR_item["qty"].ToString());
                            else
                                qty = 0;
                            if (DR_item["line_total"] != DBNull.Value && !string.IsNullOrEmpty(DR_item["line_total"].ToString()))
                                price = Convert.ToDecimal(DR_item["line_total"].ToString());
                            else
                                price = 0;
                            order_price = order_price + price;

                            str += "<Item>";
                            str += "<SKU><![CDATA[" + DR_item["sku"].ToString() + "]]></SKU>";
                            if (var_id > 0)
                                str += "<Name><![CDATA[" + DR_item["variation_title"].ToString() + "]]></Name>";
                            else
                                str += "<Name><![CDATA[" + DR_item["post_title"].ToString() + "]]></Name>";
                            str += "<Quantity>" + qty.ToString() + "</Quantity>";
                            if (price > 0)
                                str += "<UnitPrice>" + (price / qty).ToString() + "</UnitPrice>";
                            else
                                str += "<UnitPrice>0.00</UnitPrice>";
                            if (DR_item["meta_key"] != DBNull.Value && !string.IsNullOrEmpty(DR_item["meta_key"].ToString()) && DR_item["meta_value"] != DBNull.Value && !string.IsNullOrEmpty(DR_item["meta_value"].ToString()))
                            {
                                str += "<Options>";
                                str += "<Option><Name><![CDATA[" + DR_item["meta_key"].ToString() + "]]></Name><Value><![CDATA[" + DR_item["meta_value"].ToString() + "]]></Value></Option>";
                                str += "</Options>";
                            }
                            str += "</Item>";
                        }
                        str += "</Items>";

                        str += "<OrderTotal>" + order_price.ToString() + "</OrderTotal>";
                        str += "</Order>";
                    }
                    str += "</Orders>";
                }
                else if (action == "shipnotify")
                {
                    string oname = string.Empty, order_number = string.Empty, tracking_number = string.Empty, carrier = string.Empty;
                    if (Request.QueryString["order_number"] != null)
                    {
                        oname = Request.QueryString["order_number"].ToString();
                        order_number = oname.Replace("#", "").Split('-')[0].Trim();
                    }
                    if (Request.QueryString["tracking_number"] != null)
                    {
                        tracking_number = Request.QueryString["tracking_number"].ToString();
                    }
                    if (Request.QueryString["carrier"] != null)
                    {
                        carrier = Request.QueryString["carrier"].ToString();
                    }
                    String jsonData = new StreamReader(Request.InputStream).ReadToEnd();

                    //str = string.Format("insert into shipped_track (order_id,order_name,shipped_items,tracking_num,tracking_via,ship_date) VALUES ('{0}','{1}','{2}','{3}','{4}',convert(varchar(11),GETUTCDATE(),0))", order_number, oname, "items", tracking_number, carrier);
                    //DAL.SQLHelper.ExecuteNonQueryWithTrans(str + ";insert into db_log select getdate(),'" + jsonData + "'");

                    System.Xml.XmlDocument xmlDoc = new System.Xml.XmlDocument();
                    xmlDoc.LoadXml(jsonData);
                    System.Xml.XmlNodeList nodelist = xmlDoc.SelectNodes("/ShipNotice/Items/Item"); // get all <testcase> nodes
                    string shipped_items = string.Empty; int shipped_qty = 0;
                    foreach (System.Xml.XmlNode node in nodelist) // for each <testcase> node
                    {
                        shipped_items = (shipped_items.Length > 0 ? shipped_items + ", " : "") + node["Name"].InnerText + " (" + node["SKU"].InnerText + ") x " + node["Quantity"].InnerText;
                        shipped_qty += int.Parse(node["Quantity"].InnerText);
                    }
                    DataTable dt = ShipRepository.UpdateOrderShipped(Convert.ToInt64(order_number), oname, shipped_items, shipped_qty, tracking_number, carrier);
                    // My sql wp_posts data update
                    long id = Convert.ToInt64(dt.Rows[0]["id"].ToString());
                    string wpstatus = dt.Rows[0]["wpstatus"].ToString();

                    //StringBuilder strSql = new StringBuilder("Update wp_posts set post_status = '"+ wpstatus + "'  where order_id=" + id + "; ");
                    // DAL.MYSQLHelper.ExecuteNonQueryWithTrans(strSql.ToString());

                    StringBuilder strSql = new StringBuilder(string.Format("update wp_posts set post_status = '{0}' where id = {1};", wpstatus, id));
                    DAL.MYSQLHelper.ExecuteNonQuery(strSql.ToString());
                }
                else
                {
                    str = "<?xml version=\"1.0\" encoding=\"utf-8\"?><Orders></Orders>";
                }
            }
            catch (Exception ex) { str = "<?xml version=\"1.0\" encoding=\"utf-8\"?><Orders></Orders>"; }
            return Content(str, ContentType.Xml, Encoding.UTF8);
        }

        public ActionResult CreateShipOrder()
        {
            try
            {
                DataTable dt = ShipRepository.GenerateShippingOrder();
                SendPOInvoice();
            }
            catch { }
            return View();
        }
        public static void LogData(string order_number, string tracking_number, string carrier, string jsonData)
        {
            try
            {
                StringBuilder strErrorLog = new StringBuilder();
                strErrorLog.Append("\r\n ==========================================================================================================");
                strErrorLog.Append("\r\n Date Time: " + System.DateTime.UtcNow.ToString());
                strErrorLog.Append("\r\n order_number: " + order_number);
                strErrorLog.Append("\r\n tracking_number: " + tracking_number);
                strErrorLog.Append("\r\n carrier: " + carrier);
                strErrorLog.Append("\r\n jsonData : " + jsonData);
                String FileName = string.Empty;
                if (System.Web.HttpContext.Current != null)
                    FileName = System.Web.HttpContext.Current.Server.MapPath("~//Views//ship//Log" + System.DateTime.Now.Year.ToString() + System.DateTime.Now.Month.ToString() + System.DateTime.Now.Day.ToString() + ".txt");
                else
                    FileName = HttpRuntime.AppDomainAppPath.ToString() + ("Views//ship//Log" + System.DateTime.Now.Year.ToString() + System.DateTime.Now.Month.ToString() + System.DateTime.Now.Day.ToString() + ".txt");
                if (!System.IO.File.Exists(FileName))
                {
                    System.IO.File.Create(FileName).Dispose();
                    string str = "\r\n=========================================================================================================="
                               + "\r\n                                               LaylaERP                                                   "
                               + "\r\n                                           Shipping data Read                                             "
                               + "\r\n==========================================================================================================";
                    strErrorLog.Insert(0, str);
                }
                StreamWriter objStreamWriter = new StreamWriter(FileName, true);// Open for appending!
                objStreamWriter.WriteLine(strErrorLog);
                objStreamWriter.Close();
            }
            catch { }
        }

        public static void SendPOInvoice()
        {
            try
            {
                string vendor_email = string.Empty;
                DataSet ds = PurchaseOrderRepository.GetPurchaseOrderPrintList();
                string SenderEmailID = string.Empty, SenderEmailPwd = string.Empty, SMTPServerName = string.Empty;
                int SMTPServerPortNo = 587; bool SSL = false;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    SenderEmailID = (dr["SenderEmailID"] != Convert.DBNull) ? dr["SenderEmailID"].ToString() : "";
                    SenderEmailPwd = (dr["SenderEmailPwd"] != Convert.DBNull) ? dr["SenderEmailPwd"].ToString() : "";
                    SMTPServerName = (dr["SMTPServerName"] != Convert.DBNull) ? dr["SMTPServerName"].ToString() : "";
                    SMTPServerPortNo = (dr["SMTPServerPortNo"] != Convert.DBNull) ? Convert.ToInt32(dr["SMTPServerPortNo"].ToString()) : 25;
                    SSL = (dr["SSL"] != Convert.DBNull) ? Convert.ToBoolean(dr["SSL"]) : false;
                }
                string str_meta = string.Empty;
                foreach (DataRow dr in ds.Tables[1].Rows)
                {
                    vendor_email = dr["vendor_email"] != DBNull.Value ? dr["vendor_email"].ToString().Trim() : "";
                    string myHtml = "<table id=\"invoice\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width:100%;\">"
                    + "<tr>"
                    + "    <td align=\"center\" style=\"padding:0;\">"
                    + "        <table class=\"container_table\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border:2px solid #e6e6e6; width:995px\">"
                    + "            <tr>"
                    + "                <td style=\"padding:15px;\">"
                    + "                    <table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"table-layout:fixed;width:100%;border-bottom: 1px solid #ddd;\">"
                    + "                        <tr>"
                    + "                            <td style=\"padding:0; vertical-align: top;width:66.9%\">"
                    + "                                <img src=\"https://laylaerp.com/Images/layla1-logo.png\" alt=\"\" width=\"95\" height=\"41\"/>"
                    + "                                <p style=\"margin:15px 0px;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;\">"
                    + dr["company_address"].ToString() + ".<br> Phone: " + Regex.Replace(dr["company_phone"].ToString(), @"(\d{3})(\d{3})(\d{4})", "($1) $2-$3") + "<br>" + dr["company_email"].ToString() + "<br>" + dr["company_website"].ToString()
                    + "                                </p>"
                    + "                            </td>"
                    + "                            <td style=\"padding: 0; vertical-align:top; width:33.1%\" align\"left\">"
                    + "                                <table cellpadding=\"0\" cellspacing=\"0\" border=\"0\">"
                    + "                                    <tr><td colspan=\"2\" style=\"padding: 0px 2.5px 0px 0px\"><h2 style=\"color:#9da3a6;font-family: sans-serif;font-weight:700;margin:0px 0px 8px 0px;font-size: 30px;\">Invoice</h2></td></tr>"
                    + "                                    <tr><td style=\"font-family:sans-serif;font-size:15px;color:#4f4f4f;line-height: 1.4; padding:0px 2.5px;\">Invoice No #:</td><td style=\"padding:0px 2.5px;font-family: sans-serif;font-size:15px;color:#4f4f4f;line-height:1.4;\">" + dr["ref_ext"].ToString() + "</td></tr>"
                    + "                                    <tr><td style=\"font-family:sans-serif;font-size:15px;color:#4f4f4f;line-height: 1.4; padding:0px 2.5px;\">Invoice Date:</td><td style=\"padding:0px 2.5px;font-family: sans-serif;font-size:15px;color:#4f4f4f;line-height:1.4;\">" + dr["date_creation"].ToString() + "</td></tr>"
                    + "                                    <tr><td style=\"font-family:sans-serif;font-size:15px;color:#4f4f4f;line-height: 1.4; padding:0px 2.5px;\">Reference:</td><td style=\"padding:0px 2.5px;font-family: sans-serif;font-size:15px;color:#4f4f4f;line-height:1.4;\">" + dr["ref_supplier"].ToString() + "</td></tr>"
                    + "                                    <tr><td style=\"font-family:sans-serif;font-size:15px;color:#4f4f4f;line-height: 1.4; padding:0px 2.5px;\">Sale Order Reference No:</td><td style=\"padding:0px 2.5px;font-family: sans-serif;font-size:15px;color:#4f4f4f;line-height:1.4;\">" + dr["fk_projet"].ToString() + "</td></tr>"
                    + "                                    <tr><td style=\"font-family:sans-serif;font-size:15px;color:#4f4f4f;line-height: 1.4; padding:0px 2.5px;\">Expected Delivery Date:</td><td style=\"padding:0px 2.5px;font-family: sans-serif;font-size:15px;color:#4f4f4f;line-height:1.4;\">" + dr["date_livraison"].ToString() + "</td></tr>"
                    + "                                </table>"
                    + "                            </td>"
                    + "                        </tr>"
                    + "                    </table>"
                    + "                </td>"
                    + "            </tr>"
                    + "<tr>"
                    + "<td style=\"padding:0px 15px 0px 15px;\">"
                    + "    <table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width:100%;\">"
                    + "    <tr>"
                    + "        <td style=\"vertical-align: text-top;padding:0;width:33.1%\">"
                    + "            <h3 style=\"font-family: sans-serif;font-size:20px;margin:0px 0px 5px 0px;;color:#2c2e2f;font-weight:200;\">Vendor:</h3>"
                    + "            <p style=\"width: 225px;margin:0px 0px 15px 0px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;\">" + dr["vendor_address"].ToString() + "</p>"
                    + "        </td>"
                    + "        <td style=\"vertical-align: text-top;padding:0;width: 33.1\" align=\"left\">"
                    + "            <h3 style=\"font-family: sans-serif;font-size:20px;margin:0px 0px 5px 0px;color:#2c2e2f;font-weight:200;\">Delivery Address:</h3>"
                    + "            <p style=\"width: 225px;margin:0px 0px 15px 0px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;\">" + dr["delivery_address"].ToString() + "<br>Phone: " + Regex.Replace(dr["delivery_phone"].ToString(), @"(\d{3})(\d{3})(\d{4})", "($1) $2-$3") + "</p>"
                    + "        </td>"
                    + "        <td style=\"vertical-align: text-top;padding:0;width: 33.1\" align=\"left\">"
                    + "            <h3 style=\"font-family: sans-serif;font-size:20px;margin:0px 0px 5px 0px;color:#2c2e2f;font-weight:200;\">Ship To:</h3>"
                    + "            <p style=\"width: 225px;margin:0px 0px 15px 0px;font-family: sans-serif;font-size: 15px;color: #4f4f4f;line-height: 1.4;\">" + dr["ship_address"].ToString() + "<br>Phone: " + Regex.Replace(dr["ship_phone"].ToString(), @"(\d{3})(\d{3})(\d{4})", "($1) $2-$3") + "<br>" + dr["ship_email"].ToString() + "</p>"
                    + "        </td>"
                    + "     </tr>"
                    + "     </table>"
                    + "</td >"
                    + "</tr >"
                    + "<tr>"
                    + "<td style=\"padding:0px 15px 0px 15px;\">"
                    + "    <table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse;width:100%;table-layout: fixed;\">"
                    + "        <thead style=\"border:1px solid #ddd;background-color: #f9f9f9;\">"
                    + "            <tr>"
                    + "                <th style=\"width:12%;padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;\">Item#</th>"
                    + "                <th style=\"width:48%;padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;\">Description</th>"
                    + "                <th style=\"width:10%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;\">Quantity</th>"
                    + "                <th style=\"width:15%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;\">Price</th>"
                    + "                <th style=\"width:15%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;\">Amount</th>"
                    + "            </tr>"
                    + "        </thead>"
                    + "        <tbody>" + dr["items"].ToString() + "</tbody>"
                    + "    </table>"
                    + "</td>"
                    + "</tr>"
                    + "<tr>"
                    + "<td style=\"padding:0px 15px 15px 15px;\">"
                    + "    <table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse;width: 100%;table-layout:fixed;\">"
                    + "        <tr>"
                    + "            <td style=\"vertical-align:top;width:50%;padding:0px;\">"
                    + "                <table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse;width:100%; table-layout: fixed;\">"
                    //+ "                    <tr><td style=\"color:#4f4f4f;line-height:1.4;text-align:left;font-family:sans-serif;font-size:15px;padding:5px 12px;background:#f9f9f9;font-weight:600; border-bottom:1px solid #ddd;\">Comments or Special Instructions</td></tr>"
                    //+ "                    <tr><td style=\"padding:5px 12px;text-align:left;font-family:sans-serif;font-size:12px; color:#4f4f4f;line-height:1.4;\">1. Payment term:" + dr["PaymentTerm"].ToString() + ", " + dr["Balance"].ToString() + "</td></tr>"
                    //+ "                    <tr><td style=\"padding:5px 12px;text-align:left;font-family:sans-serif; font-size:12px; color:#4f4f4f;line-height:1.4;\">2. " + dr["location_incoterms"].ToString() + "</td></tr>"
                    + "                    <tr>"
                    + "                        <td style=\"border-top: 1px solid #ddd;padding:5px 12px;text-align:left;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;\">"
                    + "                            <h4 style=\"text-align:left;font-family:sans-serif;color: #555;font-size:16px;line-height:18px;margin-bottom:5px;margin-top:0px;vertical-align:middle;text-align: left;width: 100%;font-weight: 600;\">Notes</h4>"
                    + "                            <p style=\"text-align:left;font-family:sans-serif;color: #4f4f4f;font-size: 12px;line-height: 18px;margin-bottom: 0px;margin-top: 0px;vertical-align: middle;text-align: left;width: 100%;font-weight: 400;\">" + dr["note_public"].ToString() + "</p>"
                    + "                        </td>"
                    + "                    </tr>"
                    + "                </table>"
                    + "            </td>"
                    + "            <td style=\"vertical-align: top; width:50%; padding:0px;\">"
                    + "                <table cellpadding=\"0\" cellspacing=\"0\" style=\"border:1px solid #ddd;border-top:0px;border-collapse: collapse;width: 100%; table-layout: fixed;\">"
                    + "                    <tr>"
                    + "                        <td style=\"width: 40%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;\">0</td>"
                    + "                        <td style=\"border-right: 1px solid #ddd; width: 30%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;\">Subtotal</td>"
                    + "                        <td style=\"width: 30%;padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;\">$" + dr["gross_amt"].ToString() + "</td>"
                    + "                    </tr>"
                    + "                    <tr>"
                    + "                        <td colspan=\"2\" style=\"border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;\">Item discounts</td>"
                    + "                        <td style=\"padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;\">-$" + dr["discount"].ToString() + "</td>"
                    + "                    </tr>"
                    + "                    <tr>"
                    + "                        <td colspan=\"2\" style=\"border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;\">Amount tax</td>"
                    + "                        <td style=\"padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;\">$" + dr["localtax1"].ToString() + "</td>"
                    + "                    </tr>"
                    + "                    <tr>"
                    + "                        <td colspan=\"2\" style=\"border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;\">Shipping</td>"
                    + "                        <td style=\"padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;\">$" + dr["localtax2"].ToString() + "</td>"
                    + "                    </tr>"
                    + "                    <tr>"
                    + "                        <td colspan=\"2\" style=\"border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;\">Other Fee</td>"
                    + "                        <td style=\"padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;\">$" + dr["other_fee"].ToString() + "</td>"
                    + "                    </tr>"
                    + "                    <tr style=\"background-color: #f9f9f9;font-weight: 700;border-top: 1px solid #ddd;\">"
                    + "                        <td colspan=\"2\" style=\"border-right: 1px solid #ddd; padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;\">Total</td>"
                    + "                        <td style=\"padding:5px 12px;text-align:right;font-family:sans-serif; font-size:15px; color:#4f4f4f;line-height:1.4;\">$" + dr["total_ttc"].ToString() + "</td>"
                    + "                    </tr>"
                    + "                </table>"
                    + "            </td>"
                    + "        </tr>"
                    + "    </table>"
                    + "</td>"
                    + "</tr>"
                    + "</table>"
                    + "</td>"
                    + "</tr>"
                    + "</table>";

                    string strBody = "Dear User,<br /> Atteched please find your PO number #" + dr["ref_ext"].ToString() + ". If you have any questions please feel free to contact us.<br /><br /><br /><br />" + dr["company_address"].ToString() + ".<br> Phone: " + Regex.Replace(dr["company_phone"].ToString(), @"(\d{3})(\d{3})(\d{4})", "($1) $2-$3") + "<br>" + dr["company_email"].ToString() + "<br>" + dr["company_website"].ToString();

                    if (!string.IsNullOrEmpty(vendor_email) && !string.IsNullOrEmpty(SenderEmailID))
                    {
                        try
                        {
                            UTILITIES.SendEmail.SendEmails(SenderEmailID, SenderEmailPwd, SMTPServerName, SMTPServerPortNo, SSL, vendor_email, "Your Purchase order #" + dr["ref_ext"].ToString() + " has been received", strBody, myHtml);
                            str_meta += (str_meta.Length > 0 ? ", " : "") + "{ id: " + dr["rowid"].ToString() + " }";
                        }
                        catch { }
                    }

                }
                if (!string.IsNullOrEmpty(str_meta))
                {
                    System.Xml.XmlDocument orderXML = Newtonsoft.Json.JsonConvert.DeserializeXmlNode("{\"Data\":[" + str_meta + "]}", "Items");
                    PurchaseOrderRepository.SendInvoiceUpdate(orderXML);
                }
            }
            catch (Exception ex) { }
        }

        #region return order vendor approval by mail
        [Route("ship/return-order-vendor-approval")]
        public ActionResult OrderReturnVendorMail()
        {
            try
            {
                string vendor_email = string.Empty;
                DataSet ds = PurchaseOrderRepository.GetPurchaseOrderPrintList("ORVMWAIT");
                string SenderEmailID = string.Empty, SenderEmailPwd = string.Empty, SMTPServerName = string.Empty;
                int SMTPServerPortNo = 587; bool SSL = false;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    SenderEmailID = (dr["SenderEmailID"] != Convert.DBNull) ? dr["SenderEmailID"].ToString() : "";
                    SenderEmailPwd = (dr["SenderEmailPwd"] != Convert.DBNull) ? dr["SenderEmailPwd"].ToString() : "";
                    SMTPServerName = (dr["SMTPServerName"] != Convert.DBNull) ? dr["SMTPServerName"].ToString() : "";
                    SMTPServerPortNo = (dr["SMTPServerPortNo"] != Convert.DBNull) ? Convert.ToInt32(dr["SMTPServerPortNo"].ToString()) : 25;
                    SSL = (dr["SSL"] != Convert.DBNull) ? Convert.ToBoolean(dr["SSL"]) : false;
                }
                string str_meta = string.Empty;
                foreach (DataRow dr in ds.Tables[1].Rows)
                {
                    vendor_email = dr["vendor_email"] != DBNull.Value ? dr["vendor_email"].ToString().Trim() : "";
                    string html = "<div style=\"background-color:#59595b;margin:0;padding:70px 0 70px 0;width:100%;text-align: -webkit-center;\">";
                    html += "   <div>";
                    html += "       <p style=\"margin-top:0\"><img src=\"https://laylasleep.com/wp-content/uploads/2018/12/logo-mail-1.png\" alt=\"Layla\" style=\"border:none;display:inline-block;font-size:14px;font-weight:bold;height:auto;outline:none;text-decoration:none;text-transform:capitalize;vertical-align:middle;margin-right:10px\"></p>";
                    html += "   </div>";
                    html += "   <table cellspacing=\"0\" cellpadding=\"0\" border=\"0\" style=\"background-color:#ffffff;border:1px solid #505052;border-radius:3px;width:600px;-webkit-border-horizontal-spacing:0px;-webkit-border-vertical-spacing:0px;\">";
                    html += "       <tbody>";
                    html += "           <tr>";
                    html += "               <td style=\"text-align:-webkit-center;background-color: #ff4100;color: #ffffff;border-bottom: 0;font-weight: bold;line-height: 100%;vertical-align: middle;font-family: &quot;Helvetica Neue&quot;,Helvetica,Roboto,Arial,sans-serif;border-radius: 3px 3px 0 0;padding: 36px 48px;\">";
                    html += "                   <h1 style=\"font-family:Helvetica Neue,Helvetica,Roboto,Arial,sans-serif;font-size:30px;font-weight:300;line-height:150%;margin:0;text-align:left;color:#ffffff\">Refund order details.</h1>";
                    html += "               </td>";
                    html += "           </tr>";
                    html += "           <tr>";
                    html += "               <td style=\"background-color: #ffffff;padding: 48px 48px 0;text-align:-webkit-center;vertical-align: top;\">";
                    html += "                   <div style=\"color:#636363;font-family:Helvetica Neue,Helvetica,Roboto,Arial,sans-serif;font-size:14px;line-height:150%;text-align:left\">";
                    html += "                       <p style=\"margin:0 0 16px\">Hi " + dr["vendor_name"].ToString() + ",</p>";
                    html += "                       <p style=\"margin:0 0 16px\">Customer (name) has applied a refund to your Layla Order. For your reference, the details of the refund are below. </p>";
                    html += "                       <h2 style=\"color:#ff4100;display:block;font-family:&quot;Helvetica Neue&quot;,Helvetica,Roboto,Arial,sans-serif;font-size:18px;font-weight:bold;line-height:130%;margin:0 0 18px;text-align:left\">";
                    html += "                           <a href=\"http://links.laylasleep.com/ls/click?upn=yxJ3Fx6NcMiSDt7VXEtStX0MpMdm6XseJY7o7vUrOBkfVgJ4X9nkAMhNmFtKos-2B9M9Bot6bdTU3ILGkIdLKQHM5p9jjpNwPXHx9I18Bi6YA-3DTjzH_W4c-2BpSBzgNJfLcL9-2BulscTtl5jAgIO0mPlKCAnxFIDAhT4YzdMoDegxFjMmlJHaVbZHPoyOrrUK5K5luQa6zvvpABYnJiSpgtcwWZaiuEkMTkoebRytOB-2B7umgXQ6SPaTvMycMw8EfXYlFdlO9wfnmLiaa9Lg5rwWekvVjLZ-2FOB6FXNFcJ1ZNTjQ7j9pjdu-2By6ZpsAUUp-2B7CtwSDu9SXYQv0Wrnsj7EFlEVg1X1B24M1oz-2F4-2FlmuuMyXvJqYop-2Bhpp3J2N2teeA13cp-2FkYfxjQ-3D-3D\" style =\"font-weight:normal;text-decoration:underline;color:#ff4100\" target =\"_blank\" >[Order #" + dr["fk_projet"].ToString() + "]</a> (" + dr["date_creation"].ToString() + ")";
                    html += "                       </h2>";
                    html += "                       <div style=\"margin-bottom:40px\">";
                    html += "                           <table cellspacing=\"0\" cellpadding=\"6\" border=\"1\" style=\"color:#636363;border:1px solid #e5e5e5;vertical-align:middle;width:100%;font-family:'Helvetica Neue',Helvetica,Roboto,Arial,sans-serif\">";
                    html += "                               <thead>";
                    html += "                                   <tr>";
                    html += "                                       <th style=\"color:#636363;border:1px solid #e5e5e5;vertical-align:middle;padding:12px;text-align:left;width:75%;\">Product</th>";
                    html += "                                       <th style=\"color:#636363;border:1px solid #e5e5e5;vertical-align:middle;padding:12px;text-align:right;width:25%;\">Quantity</th>";
                    html += "                                   </tr>";
                    html += "                               </thead>";
                    html += "                               <tbody>" + dr["items"].ToString() + "</tbody>";
                    html += "                               <tfoot>";
                    html += "                                   <tr>";
                    html += "                                       <th colspan=\"2\" style=\"border:0px solid #e5e5e5;padding:12px;text-align:end;\">";
                    html += "                                           <a href=\"" + dr["base_url"].ToString() + "/ship/return-order-conform?key=00&id=" + dr["fk_projet"].ToString() + "\" target=\"_blank\" style=\"margin:12px;min-width:110px;background-color:#0070BA;color:#fff;font-size:12px;box-sizing:border-box!important;padding: 8px;border-radius:5px;font-weight:600;\">conform</a>";
                    html += "                                       </th>";
                    html += "                                   </tr>";
                    html += "                               </tfoot>";
                    html += "                           </table>";
                    html += "                       </div>";
                    html += "                       <table cellspacing=\"0\" cellpadding=\"0\" border=\"0\" style=\"width:100%;vertical-align:top;margin-bottom:40px;padding:0\">";
                    html += "                           <tbody>";
                    html += "                               <tr>";
                    html += "                                   <td valign=\"top\" width=\"50%\" style=\"text-align:left;font-family:'Helvetica Neue',Helvetica,Roboto,Arial,sans-serif;border:0;padding:0\">";
                    html += "                                       <h2 style=\"color:#ff4100;display:block;font-family:Helvetica Neue,Helvetica,Roboto,Arial,sans-serif;font-size:18px;font-weight:bold;line-height:130%;margin:0 0 18px;text-align:left\">Billing address</h2>";
                    html += "                                       <address style=\"padding:12px 12px 0;color:#636363;border:1px solid #e5e5e5\">" + dr["billing_address"].ToString() + "</address>";
                    html += "                                   </td>";
                    html += "                                   <td valign=\"top\" width=\"50%\" style=\"text-align:left;font-family:'Helvetica Neue',Helvetica,Roboto,Arial,sans-serif;border:0;padding:0\">";
                    html += "                                       <h2 style=\"color:#ff4100;display:block;font-family:Helvetica Neue,Helvetica,Roboto,Arial,sans-serif;font-size:18px;font-weight:bold;line-height:130%;margin:0 0 18px;text-align:left\">Pickup address</h2>";
                    html += "                                       <address style=\"padding:12px 12px 0;color:#636363;border:1px solid #e5e5e5\">" + dr["ship_address"].ToString() + "</address>";
                    html += "                                   </td>";
                    html += "                               </tr>";
                    html += "                           </tbody>";
                    html += "                       </table>";
                    html += "                   </div>";
                    html += "               </td>";
                    html += "           </tr>";
                    html += "           <tr>";
                    html += "               <td align=\"center\" valign=\"top\" style=\"border: 0;color:#ff8d66;font-family:Arial;font-size:12px;line-height:125%;text-align:center;padding:0 48px 48px 48px;\">";
                    html += "                   <p>" + dr["company_address"].ToString() + "<br>855-358-1676<br>";
                    html += "                       <a href=\"mailto:" + dr["company_email"].ToString() + "\" target=\"_blank\">" + dr["company_email"].ToString() + " </a>";
                    html += "                   </p>";
                    html += "               </td>";
                    html += "           </tr>";
                    html += "       </tbody>";
                    html += "   </table>";
                    html += "</div>";

                    if (!string.IsNullOrEmpty(vendor_email) && !string.IsNullOrEmpty(SenderEmailID))
                    {
                        try
                        {
                            UTILITIES.SendEmail.SendEmails(SenderEmailID, SenderEmailPwd, SMTPServerName, SMTPServerPortNo, SSL, vendor_email, "Refund order #" + dr["fk_projet"].ToString() + " details", html, string.Empty);
                            str_meta += (str_meta.Length > 0 ? ", " : "") + "{ id: " + dr["rowid"].ToString() + " }";
                        }
                        catch { }
                    }

                }
                if (!string.IsNullOrEmpty(str_meta))
                {
                    //System.Xml.XmlDocument orderXML = Newtonsoft.Json.JsonConvert.DeserializeXmlNode("{\"Data\":[" + str_meta + "]}", "Items");
                    //PurchaseOrderRepository.SendInvoiceUpdate(orderXML);
                }
            }
            catch { }
            return View();
        }
        [Route("ship/return-order-conform")]
        public ActionResult OrderReturnConform(string id, string key)
        {
            if (!string.IsNullOrEmpty(id))
            {
                long parent_order_id = 0; decimal order_amount = 0; string result = string.Empty;
                DateTime cDate = UTILITIES.CommonDate.CurrentDate(), cUTFDate = UTILITIES.CommonDate.UtcDate();
                /// step 1 : wp_posts
                string strSql = string.Format("update wp_posts set post_status = '{0}',post_modified = '{1}',post_modified_gmt = '{2}' where id = {3} and post_status = 'wc-processing';", "wc-completed", cDate.ToString("yyyy-MM-dd HH:mm:ss"), cUTFDate.ToString("yyyy-MM-dd HH:mm:ss"), id);
                int i = DAL.MYSQLHelper.ExecuteNonQueryWithTrans(strSql.ToString());
                if (i > 0)
                {
                    DataTable dt = CustomerServiceRepository.CustomerTicketInfo(0, Convert.ToInt64(id), "VENDORCONFORM");
                    foreach (DataRow dr in dt.Rows)
                    {
                        parent_order_id = (dr["post_id"] != DBNull.Value ? Convert.ToInt64(dr["post_id"].ToString().Trim()) : 0);
                        order_amount = (dr["order_amount"] != DBNull.Value ? Convert.ToDecimal(dr["order_amount"].ToString().Trim()) : 0);
                        if (dr["payment_method"].ToString().Trim() == "podium")
                        {
                            clsPodiumModal obj = new clsPodiumModal();
                            obj.locationUid = dr["podium_location_uid"].ToString().Trim();
                            obj.invoiceNumber = dr["podium_uid"].ToString().Trim();
                            obj.uid = dr["podium_payment_uid"].ToString().Trim();
                            obj.amount = Convert.ToInt32(order_amount * 100);
                            obj.reason = "requested_by_customer";

                            result = clsPodium.PodiumInvoiceRefund(obj);
                            if (!string.IsNullOrEmpty(result))
                            {
                                OrderNotesModel notesModel = new OrderNotesModel();
                                notesModel.post_ID = parent_order_id; notesModel.comment_content = string.Format("Refund Issued for ${0:0.00}. The refund should appear on your statement in 5 to 10 days.", order_amount);
                                notesModel.is_customer_note = string.Empty; notesModel.comment_author = string.Empty; notesModel.comment_author_email = string.Empty;
                                OrderRepository.AddOrderNotes(notesModel);
                            }
                        }
                        else if (dr["payment_method"].ToString().Trim() == "authorize_net_cim_credit_card")
                        {
                            string TransactionID = string.Empty, CardNumber = string.Empty, ExpirationDate = string.Empty, crdtype = string.Empty, ExpirationDatePrint = string.Empty;
                            TransactionID = (dt.Rows[0]["authorize_net_trans_id"] != Convert.DBNull) ? dt.Rows[0]["authorize_net_trans_id"].ToString() : "";
                            CardNumber = (dt.Rows[0]["authorize_net_card_account_four"] != Convert.DBNull) ? dt.Rows[0]["authorize_net_card_account_four"].ToString() : "";
                            crdtype = (dt.Rows[0]["authorize_net_cim_credit_card_card_type"] != Convert.DBNull) ? dt.Rows[0]["authorize_net_cim_credit_card_card_type"].ToString() : "";
                            ExpirationDate = (dt.Rows[0]["authorize_net_card_expiry_date"] != Convert.DBNull) ? dt.Rows[0]["authorize_net_card_expiry_date"].ToString() : "";
                            ExpirationDatePrint = ExpirationDate.Split('-')[1] + "/" + ExpirationDate.Split('-')[0];
                            ExpirationDate = ExpirationDate.Split('-')[1] + ExpirationDate.Split('-')[0];
                            result = clsAuthorizeNet.RefundTransaction(TransactionID, CardNumber, ExpirationDate, order_amount);
                            if (!string.IsNullOrEmpty(result))
                            {
                                OrderNotesModel notesModel = new OrderNotesModel();
                                notesModel.post_ID = parent_order_id;
                                notesModel.comment_content = string.Format("Authorize.Net Credit Card Charge Refund Issued: {0} ending in {1} (expires {2}) (Transaction ID {3}). Refund Issued for ${4}. The refund should appear on your statement in 5 to 10 days.", crdtype, CardNumber, ExpirationDatePrint, result, order_amount);
                                notesModel.is_customer_note = string.Empty; notesModel.comment_author = string.Empty; notesModel.comment_author_email = string.Empty;
                                OrderRepository.AddOrderNotes(notesModel);
                            }
                        }
                        else if (dr["payment_method"].ToString().Trim() == "affirm")
                        {
                            string TransactionID = string.Empty;
                            TransactionID = (dt.Rows[0]["transaction_id"] != Convert.DBNull) ? dt.Rows[0]["transaction_id"].ToString() : "";
                            result = clsAffirm.AffirmRefund(TransactionID, order_amount);
                            if (!string.IsNullOrEmpty(result))
                            {
                                OrderNotesModel notesModel = new OrderNotesModel();
                                notesModel.post_ID = parent_order_id;
                                notesModel.comment_content = string.Format("Refunded ${0} - Refund ID: {1} - Reason: Customer Return", order_amount, result);
                                notesModel.is_customer_note = string.Empty; notesModel.comment_author = string.Empty; notesModel.comment_author_email = string.Empty;
                                OrderRepository.AddOrderNotes(notesModel);
                            }
                        }
                        else if (dr["payment_method"].ToString().Trim() == "amazon_payments_advanced")
                        {
                            string TransactionID = string.Empty;
                            TransactionID = (dt.Rows[0]["amazon_capture_id"] != Convert.DBNull) ? dt.Rows[0]["amazon_capture_id"].ToString() : "";
                            result = clsAmazonPay.RefundTransaction(id.ToString(), TransactionID, order_amount);
                            if (!string.IsNullOrEmpty(result))
                            {
                                OrderNotesModel notesModel = new OrderNotesModel();
                                notesModel.post_ID = parent_order_id;
                                notesModel.comment_content = string.Format("Amazon Pay Refund Issued. Transaction ID {0}. Refund Issued for ${0:0.00}. The refund should appear on your statement in 5 to 10 days.", result, order_amount);
                                notesModel.is_customer_note = string.Empty; notesModel.comment_author = string.Empty; notesModel.comment_author_email = string.Empty;
                                OrderRepository.AddOrderNotes(notesModel);
                            }
                        }
                        if (dr["payment_method"].ToString().Trim() == "ppec_paypal")
                        {
                            string TransactionID = string.Empty;
                            TransactionID = (dt.Rows[0]["amazon_capture_id"] != Convert.DBNull) ? dt.Rows[0]["amazon_capture_id"].ToString() : "";
                            if (dr["post_mime_type"].ToString().Trim() == "shop_order_erp" || dr["post_mime_type"].ToString().Trim() == "shopordererp")
                                result = clsPayPal.PaypalInvoiceRefund(TransactionID, DateTime.Today.ToString("yyyy-MM-dd"), order_amount);
                            else
                                result = clsPayPal.PaypalPaymentRefund(TransactionID, "INVOICE - " + id + "-" + DateTime.Today.ToString("yyyyMMddmmss"), "", order_amount);
                            if (!string.IsNullOrEmpty(result))
                            {
                                var dyn = JsonConvert.DeserializeObject<dynamic>(result);
                                OrderNotesModel notesModel = new OrderNotesModel();
                                notesModel.post_ID = parent_order_id; notesModel.comment_content = string.Format("PayPal Refund Issued for ${0:0.00}. transaction ID = {1}", order_amount, dyn.refund_id);
                                notesModel.is_customer_note = string.Empty; notesModel.comment_author = string.Empty; notesModel.comment_author_email = string.Empty;
                                OrderRepository.AddOrderNotes(notesModel);
                            }
                        }
                    }
                    //DAL.SQLHelper.ExecuteNonQuery("update erp_product_warranty_chats_action set is_confirmed_by_vendor = 1,confirmed_by_vendor_date =getdate() where new_order_id = " + id.ToString());

                    ViewBag.status = "Refund order confirmed successfully.";
                    ViewBag.id = id;
                }
                else
                {
                    ViewBag.status = "You don't have permission to access please contact administrator.";
                    ViewBag.id = "0";
                }
            }
            return View();
        }
        #endregion
    }
}