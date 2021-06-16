using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using LaylaERP.Models;
using LaylaERP.BAL;
using Newtonsoft.Json;

namespace LaylaERP.Controllers
{
    public class ExportController : Controller
    {
        // GET: Export
        public ActionResult Export()
        {
            return View();
        }

        public ActionResult GetData()
        {
            ExportRepository.ExportOrderDetails();
            return Json(new { data = ExportRepository.userlist }, JsonRequestBehavior.AllowGet);
        }


        public JsonResult UsersExport()
        {

            ExportRepository.ExportUsersDetails();
            return Json(new { data = ExportRepository.usersexportlist }, JsonRequestBehavior.AllowGet);
            //string result = string.Empty;
            //DataTable dt = ExportRepository.Show_Export_Data();
            ////result = dt;
            //return Json(new { data = dt }, 0);
        }
    }
}