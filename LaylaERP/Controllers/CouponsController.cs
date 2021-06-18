using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LaylaERP.Controllers
{
    public class CouponsController : Controller
    {
        // GET: Coupons
        public ActionResult Index()
        {
            return View("Coupons");
        }
    }
}