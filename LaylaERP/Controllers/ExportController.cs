using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using LaylaERP.Models;
using LaylaERP.BAL;
using Newtonsoft.Json;
using System.Web.Script.Serialization;

namespace LaylaERP.Controllers
{
    public class ExportController : Controller
    {

        // GET: Export
        public ActionResult Export()
        {

            return View();
        }

        [HttpPost]
        public ActionResult GetData(string from_date, string to_date)
        {

            ExportRepository.ExportOrderDetails(from_date, to_date);
            var k = Json(new { data = ExportRepository.exportorderlist }, JsonRequestBehavior.AllowGet);
            k.MaxJsonLength = int.MaxValue;
            return k;
        }

        [HttpPost]
        public JsonResult UsersExport(string from_dateusers, string to_dateusers)
        {
            //ExportRepository.myexport();
            ExportRepository.ExportUsersDetails(from_dateusers, to_dateusers);
            var j = Json(new { data = ExportRepository.usersexportlist }, JsonRequestBehavior.AllowGet);
            j.MaxJsonLength = int.MaxValue;
            return j;

        }
    }
}