using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LaylaERP.Controllers
{
    public class BankController : Controller
    {
        // GET: Bank
        public ActionResult financialaccount()
        {
            return View();
        }

        // GET: Add Fin A/C
        public ActionResult newfinaccount()
        {
            return View();
        }
    }
}