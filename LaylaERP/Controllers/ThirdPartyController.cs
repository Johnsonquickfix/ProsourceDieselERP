using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LaylaERP.Controllers
{
    public class ThirdPartyController : Controller
    {
        // GET: ThirdParty
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult NewVendor()
        {
            return View();
        }

    }
}