using LaylaERP.BAL;
using Newtonsoft.Json;
using RestSharp.Serialization;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace LaylaERP_v1.Controllers
{
    public class DataImportController : Controller
    {
        // GET: DataImport
        public ActionResult Index()
        {
            try
            {
                var result = string.Empty;
                var content = new StringContent("{}", Encoding.UTF8, "application/json");
                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri("https://quickfixtest2.com/exportdata.php");
                    client.DefaultRequestHeaders.AcceptLanguage.Add(new StringWithQualityHeaderValue("en_US"));

                    ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072;
                    var response = client.PostAsync("", content).Result;

                    if (response != null && response.IsSuccessStatusCode)
                    {
                        result = response.Content.ReadAsStringAsync().Result;
                    }
                }

                if (!string.IsNullOrEmpty(result))
                {
                    //var dyn = JsonConvert.DeserializeObject<dynamic>(result);
                    OrderRepository.ImportOrders(result);
                }
            }
            catch { }
            return View();
        }

        public ActionResult ExportData()
        {
            
            var result = string.Empty;
            try
            {
                Dictionary<string,Dictionary<string, object>> parentRow = new Dictionary<string,Dictionary<string, object>>();
                Dictionary<string, object> childRow;
                DataTable dt = OrderRepository.ExportOrders();
                foreach (DataRow row in dt.Rows)
                {
                    childRow = new Dictionary<string, object>();
                    //childRow.Add("id", row["id"]);
                    //childRow.Add("post_status", row["post_status"]);
                    //childRow.Add("post_date", row["post_date"]);
                    //childRow.Add("order_total", row["order_total"]);
                    //childRow.Add("shipstation_shipped_item_count", row["shipstation_shipped_item_count"]);

                    if (row["posts"] != DBNull.Value)
                    {
                        dynamic obj = JsonConvert.DeserializeObject<dynamic>(row["posts"].ToString());
                        childRow.Add("posts", obj);
                    }
                    else
                        childRow.Add("posts", "{}");
                    //if (row["post_meta"] != DBNull.Value)
                    //{
                    //    dynamic obj = JsonConvert.DeserializeObject<dynamic>(row["post_meta"].ToString());
                    //    childRow.Add("post_meta", obj);
                    //}
                    //else
                    //    childRow.Add("post_meta", "{}");
                    if (row["wc_order_stats"] != DBNull.Value)
                    {
                        dynamic obj = JsonConvert.DeserializeObject<dynamic>(row["wc_order_stats"].ToString());
                        childRow.Add("wc_order_stats", obj);
                    }
                    else
                        childRow.Add("wc_order_stats", "{}");
                    parentRow.Add(row["id"].ToString(), childRow);
                }
                result = JsonConvert.SerializeObject(parentRow, Formatting.Indented);
            }
            catch { }
            return Content(result, ContentType.Json, Encoding.UTF8);
        }
    }
}