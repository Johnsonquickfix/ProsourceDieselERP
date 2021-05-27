using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LaylaERP.Controllers
{
    public class OrdersController : Controller
    {
        // GET: New Orders
        public ActionResult NewOrders()
        {
            return View();
        }

        // GET: Orders History/View
        public ActionResult OrdersHistory()
        {
            return View();
        }
    }
}