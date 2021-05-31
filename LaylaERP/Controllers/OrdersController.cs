namespace LaylaERP.Controllers
{
    using BAL;
    using Models;
    using Newtonsoft.Json;
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Linq;
    using System.Web;
    using System.Web.Mvc;


    public class OrdersController : Controller
    {
        // GET: New Orders
        public ActionResult NewOrders()
        {
            //ViewBag.OrderNo = OrderRepository.AddOrdersPost();
            return View();
        }

        // GET: Orders History/View
        public ActionResult OrdersHistory()
        {
            return View();
        }

        [HttpPost]
        public JsonResult GetCustomerList(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable DT = OrderRepository.GetCustomers(model.strValue1);
                JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        [HttpPost]
        public JsonResult GetCustomerAddress(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                long id = 0;
                if (!string.IsNullOrEmpty(model.strValue1))
                    id = Convert.ToInt64(model.strValue1);
                DataTable DT = OrderRepository.GetCustomersInfo(id);
                JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        [HttpPost]
        public JsonResult GetProductList(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable DT = OrderRepository.GetProducts(model.strValue1);
                JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch { }
            return Json(JSONresult, 0);
        }
    }
}