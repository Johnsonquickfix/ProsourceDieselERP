using LaylaERP.BAL;
using LaylaERP.Models;
using LaylaERP.UTILITIES;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LaylaERP.Controllers
{
    public class CustomSearchController : Controller
    {
        [Route("customsearch/ordersearch")]
        public ActionResult OrderSearch()
        {
            return View();
        }
        [HttpGet, Route("customsearch/filtermasters")]
        public JsonResult GetFilterMasters(SearchModel model)
        {
            string result = string.Empty;
            try
            {
                string flag = "MASTER";
                if (model.strValue1 == "ORDER") flag = "ORDERMASTER";
                result = JsonConvert.SerializeObject(CustomSearchRepository.GetFilterMasters(flag), Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }
        [HttpPost, Route("customsearch/order-list")]
        public JsonResult GetOrderList(CustomSearchModel model)
        {
            string result = string.Empty;
            try
            {
                result = JsonConvert.SerializeObject(CustomSearchRepository.GetOrderList(model), Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }
    }
}