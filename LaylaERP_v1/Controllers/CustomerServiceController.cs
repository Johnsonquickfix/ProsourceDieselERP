using LaylaERP.BAL;
using LaylaERP.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LaylaERP.Controllers
{
    public class CustomerServiceController : Controller
    {
        [Route("customer-service/search-customer")]
        public ActionResult CustomerSearch()
        {
            return View();
        }
        [HttpGet]
        [Route("customer-service/order-list")]
        public JsonResult GetOrderList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                long customer_id = 0, order_id = 0;
                if (!string.IsNullOrEmpty(model.strValue1))
                    customer_id = Convert.ToInt64(model.strValue1);
                if (!string.IsNullOrEmpty(model.strValue2))
                    order_id = Convert.ToInt64(model.strValue2);

                DataTable dt = CustomerServiceRepository.CustomerOrders(customer_id, order_id, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, aaData = result }, 0);
        }
    }
}