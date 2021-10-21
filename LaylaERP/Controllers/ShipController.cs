using LaylaERP.BAL;
using RestSharp.Serialization;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
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
                        str += "<ShippingMethod><![CDATA[USPSPriorityMail]]></ShippingMethod>";
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
                    //$order = wc_get_order( $order_number); 
                    str = jsonData;

                    //$timestamp = current_time('timestamp'); 
                    //$shipstation_xml = file_get_contents('php://input'); 

                    List<string> shipped_items = new List<string>();
                    //int shipped_item_count = 0;
                    //bool order_shipped = false;
                    //string order_note = "";
                }
                else
                {
                    str = "<?xml version=\"1.0\" encoding=\"utf-8\"?><Orders></Orders>";
                }
            }
            catch { str = "<?xml version=\"1.0\" encoding=\"utf-8\"?><Orders></Orders>"; }
            return Content(str, ContentType.Xml, Encoding.UTF8);
        }

        public ActionResult CreateShipOrder()
        {
            try
            {
                DataTable dt = ShipRepository.GetPendingShipOrdersList();
                foreach (DataRow dr in dt.Rows)
                {
                    if (dr["id"] != DBNull.Value)
                    {
                        try
                        {
                            ShipRepository.CreateShipOrder(Convert.ToInt64(dr["id"].ToString()));
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