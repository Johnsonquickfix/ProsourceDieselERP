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

        public ActionResult GetData()
        {
            ExportRepository.ExportOrderDetails();
            var k = Json(new { data = ExportRepository.exportorderlist }, JsonRequestBehavior.AllowGet);
            k.MaxJsonLength = int.MaxValue;
            return k;
        }


        public JsonResult UsersExport()
        {
           
            ExportRepository.ExportUsersDetails();
            var j = Json(new { data = ExportRepository.usersexportlist }, JsonRequestBehavior.AllowGet);
            j.MaxJsonLength = int.MaxValue;
            return j;
        }
    }
}