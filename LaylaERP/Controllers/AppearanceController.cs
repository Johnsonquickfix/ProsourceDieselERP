using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LaylaERP.Controllers
{
    public class AppearanceController : Controller
    {
        // GET: Appearance
        public ActionResult Index()
        {
            return View("Menus");
        }
    }
}