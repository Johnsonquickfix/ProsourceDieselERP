using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using LaylaERP.Models;

namespace LaylaERP.Controllers
{
    public class UsersController : Controller
    {
        // GET: Users
        public ActionResult Users()
        {
            return View();
        }
    }
}