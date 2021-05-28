using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using LaylaERP.Models;

namespace LaylaERP.Controllers
{
    public class ExportController : Controller
    {
        // GET: Export
        public ActionResult Export()
        {
            return View();
        }

        // GET: RoleBaseReport
        public ActionResult RoleBaseReport()
        {
            return View();
        }

        public ActionResult GetData()
        {
            Export_Details objuser = new Export_Details();
            Models.Export_Details.Show_Export_Data();
            return Json(new { data = Models.Export_Details.userlist }, JsonRequestBehavior.AllowGet);
        }
    }
}