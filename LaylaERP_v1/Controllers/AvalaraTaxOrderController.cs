namespace LaylaERP.Controllers
{
    using LaylaERP.BAL;
    using LaylaERP.UTILITIES;
    using Newtonsoft.Json;
    using System;
    using System.Data;
    using System.Net;
    using System.Text;
    using System.Web.Mvc;

    public class AvalaraTaxOrderController : Controller
    {
        // GET: AvalaraTaxOrder
        public ActionResult CreateOrder()
        {
            try
            {
                string orders_json = string.Empty, order_refund_json = string.Empty, order_ids = string.Empty;
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
                            order_ids += (order_ids.Length > 0 ? ", " : "") + transaction_id;
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
                if (!string.IsNullOrEmpty(order_ids))
                {
                    DateTime cDate = CommonDate.CurrentDate(), cUTFDate = CommonDate.UtcDate();
                    StringBuilder strSql = new StringBuilder(string.Format("update wp_postmeta set meta_value = '{0}' where post_id in ({1}) and meta_key = '_taxjar_last_sync';", cUTFDate.ToString("yyyy-MM-dd HH:mm:ss"), order_ids));
                    strSql.Append(string.Format("insert into wp_postmeta(post_id,meta_key,meta_value) select post_id,'_taxjar_last_sync' meta_key,'{0}' meta_value from wp_postmeta where post_id in ({1}) and post_id not in (select p.post_id from wp_postmeta p where p.post_id in ({1}) and meta_key = '_taxjar_last_sync') and meta_key = '_order_total';", cUTFDate.ToString("yyyy-MM-dd HH:mm:ss"), order_ids));
                    DAL.MYSQLHelper.ExecuteNonQuery(strSql.ToString());
                }
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