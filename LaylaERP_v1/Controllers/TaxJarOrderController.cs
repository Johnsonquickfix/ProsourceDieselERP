using LaylaERP.BAL;
using LaylaERP.UTILITIES;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using Taxjar;
namespace LaylaERP.Controllers
{
    public class TaxJarOrderController : Controller
    {
        // GET: TaxJarOrder
        public ActionResult CreateOrder()
        {
            try
            {
                DataSet ds = OrderRepository.GetCompleteOrdersList();
                string TaxjarAPIId = string.Empty;
                foreach (DataRow dr in ds.Tables[1].Rows) {
                    TaxjarAPIId = dr[0].ToString().Trim();
                }

                var client = new TaxjarApi(TaxjarAPIId);

                string str_meta = string.Empty;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    var dyn = JsonConvert.DeserializeObject<dynamic>(dr[0].ToString());
                    foreach (var inputAttribute in dyn.orders)
                    {
                        string StatusCode = "";
                        string transaction_id = inputAttribute.transaction_id.Value.ToString();
                        ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072;
                        try
                        {
                            client.ShowOrder(transaction_id);
                        }
                        catch (TaxjarException e)
                        {
                            StatusCode = e.TaxjarError.StatusCode;
                            // 406 Not Acceptable – transaction_id is missing
                            //e.TaxjarError.Error;
                            //e.TaxjarError.Detail;
                            //e.TaxjarError.StatusCode;
                        }
                        if (StatusCode.Contains("404"))
                        {
                            try
                            {
                                var order = client.CreateOrder(inputAttribute);
                                str_meta += (str_meta.Length > 0 ? ", " : "") + "{ post_id: " + transaction_id + ", meta_key: '_taxjar_last_sync', meta_value: '' }";
                            }
                            catch { }
                        }
                    }
                }
                if (!string.IsNullOrEmpty(str_meta))
                {
                    System.Xml.XmlDocument postsXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");
                    System.Xml.XmlDocument order_statsXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");
                    System.Xml.XmlDocument postmetaXML = JsonConvert.DeserializeXmlNode("{\"Data\":[" + str_meta + "]}", "Items");
                    System.Xml.XmlDocument order_itemsXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");
                    System.Xml.XmlDocument order_itemmetaXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");

                    OrderRepository.AddOrdersPost(0, "TXSYN", 0, string.Empty, postsXML, order_statsXML, postmetaXML, order_itemsXML, order_itemmetaXML);
                }
            }
            catch { }
            return View();
        }
    }
}