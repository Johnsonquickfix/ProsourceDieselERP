using LaylaERP.BAL;
using MySql.Data.MySqlClient;
using Newtonsoft.Json;
using RestSharp.Serialization;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace LaylaERP.Controllers
{
    public class ProductReviewImportController : Controller
    {
        // GET: ProductReviewImport
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Starrating()
        {

            var result = string.Empty;
            try
            {
                string client_id = "E60CF48F-7EA9-4161-8D18-C84544B44266";
                var dt = CMSRepository.reviewupdate("FETCH", client_id);
                if (dt == 555)
                     result = JsonConvert.SerializeObject("Product Review updated", Formatting.Indented);
                 else
                    result = JsonConvert.SerializeObject("something went wrong", Formatting.Indented);
            }
            catch { }
            return Content(result, ContentType.Json, Encoding.UTF8);
        }
    }
}