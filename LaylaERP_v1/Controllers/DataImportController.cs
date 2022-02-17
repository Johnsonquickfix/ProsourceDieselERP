using LaylaERP.BAL;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
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
    }
}