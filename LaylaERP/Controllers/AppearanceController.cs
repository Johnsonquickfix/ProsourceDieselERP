using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using LaylaERP.BAL;


namespace LaylaERP.Controllers
{
    public class AppearanceController : Controller
    {
        // GET: Appearance
        public ActionResult Index()
        {
            return View("Menus");
        }

        public ActionResult GetERPMenus()
        {
            AppearanceRepository.GetERPMenus();
            return Json(new { data = AppearanceRepository.GetERPMenus() }, JsonRequestBehavior.AllowGet);
        }
    }
}