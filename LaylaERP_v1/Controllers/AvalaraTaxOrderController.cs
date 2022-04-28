namespace LaylaERP.Controllers
{
    using LaylaERP.BAL;
    using LaylaERP.UTILITIES;
    using Newtonsoft.Json;
    using System;
    using System.Data;
    using System.Net;
    using System.Web.Mvc;

    public class AvalaraTaxOrderController : Controller
    {
        // GET: AvalaraTaxOrder
        public ActionResult CreateOrder()
        {
            try
            {
                string orders_json = string.Empty, order_refund_json = string.Empty;
                DataSet ds = OrderRepository.GetCompleteOrdersList("OAVAL", out orders_json, out order_refund_json);
                string username = string.Empty, password = string.Empty;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    username = dr["username"].ToString().Trim();
                    password = dr["password"].ToString().Trim();
                }
                string str_meta = string.Empty;
                if (!string.IsNullOrEmpty(orders_json))
                {
                    var dyn = JsonConvert.DeserializeObject<dynamic>(orders_json);
                    foreach (var inputAttribute in dyn.orders)
                    {
                        //string StatusCode = "";
                        string transaction_id = inputAttribute.transaction_id.Value.ToString();
                        ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072;
                        try
                        {
                            clsAvalara.CreateOrder(username, password, inputAttribute.ToString());

                            //client.DeleteOrder(transaction_id);
                            //client.CreateOrder(inputAttribute);
                            str_meta += (str_meta.Length > 0 ? ", " : "") + "{ post_id: " + transaction_id + ", meta_key: '_taxjar_last_sync', meta_value: '' }";
                        }
                        catch (Exception e)
                        {
                            //StatusCode = e.TaxjarError.StatusCode;
                            // 406 Not Acceptable – transaction_id is missing
                            //e.TaxjarError.Error;
                            //e.TaxjarError.Detail;
                            //e.TaxjarError.StatusCode;
                        }
                        //if (StatusCode.Contains("404"))
                        //{
                        //    try
                        //    {
                        //        var order = client.CreateOrder(inputAttribute);
                        //        str_meta += (str_meta.Length > 0 ? ", " : "") + "{ post_id: " + transaction_id + ", meta_key: '_taxjar_last_sync', meta_value: '' }";
                        //    }
                        //    catch (Exception ex) { }
                        //}
                    }
                }
                //if (!string.IsNullOrEmpty(order_refund_json))
                //{
                //    var dyn_or = JsonConvert.DeserializeObject<dynamic>(order_refund_json);
                //    foreach (var inputAttribute in dyn_or.orders)
                //    {
                //        string StatusCode = "";
                //        string transaction_id = inputAttribute.transaction_id.Value.ToString();
                //        ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072;
                //        try
                //        {
                //            client.ShowRefund(transaction_id);
                //            //client.DeleteRefund(transaction_id);
                //        }
                //        catch (TaxjarException e)
                //        {
                //            StatusCode = e.TaxjarError.StatusCode;
                //            // 406 Not Acceptable – transaction_id is missing
                //            //e.TaxjarError.Error;
                //            //e.TaxjarError.Detail;
                //            //e.TaxjarError.StatusCode;
                //        }
                //        if (StatusCode.Contains("404"))
                //        {
                //            try
                //            {
                //                var order = client.CreateRefund(inputAttribute);
                //                str_meta += (str_meta.Length > 0 ? ", " : "") + "{ post_id: " + transaction_id + ", meta_key: '_taxjar_last_sync', meta_value: '' }";
                //            }
                //            catch (Exception ex) { }
                //        }
                //    }
                //}
                //if (!string.IsNullOrEmpty(str_meta))
                //{
                //    System.Xml.XmlDocument postsXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");
                //    System.Xml.XmlDocument order_statsXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");
                //    System.Xml.XmlDocument postmetaXML = JsonConvert.DeserializeXmlNode("{\"Data\":[" + str_meta + "]}", "Items");
                //    System.Xml.XmlDocument order_itemsXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");
                //    System.Xml.XmlDocument order_itemmetaXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");

                //    OrderRepository.AddOrdersPost(0, "TXSYN", 0, string.Empty, postsXML, order_statsXML, postmetaXML, order_itemsXML, order_itemmetaXML);
                //}
            }
            catch (Exception ex) { }
            return View();
        }
    }
}