using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LaylaERP.Controllers
{
    public class EmailNotificationsController : Controller
    {
        // GET: EmailNotifications
        public ActionResult Index()
        {
            return View();
        }
        // GET: New Orders
        public ActionResult NewOrder(long id = 0)
        {
            ViewBag.id = id;
            return View();
        }
    }
}