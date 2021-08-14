using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LaylaERP.Controllers
{
    public class AccountingController : Controller
    {
        // GET: Accounting Journal
        public ActionResult AccountingJournal()
        {
            return View();
        }

        // GET: chart of accounts
        public ActionResult chartofaccounts()
        {
            return View();
        }

        // GET: product accounts
        public ActionResult productsaccount()
        {
            return View();
        }
    }
}