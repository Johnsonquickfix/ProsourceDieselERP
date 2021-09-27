using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LaylaERP.Controllers
{
    public class EmailSettingController : Controller
    {
        // GET: EmailSetting
        public ActionResult EmailNotifications()
        {
            return View();
        }

        // GET: EmailSetting
        public ActionResult ManageEmailNotifications()
        {
            return View();
        }
    }
}