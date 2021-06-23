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
            return Json(new { data = ExportRepository.userlist }, JsonRequestBehavior.AllowGet);
        }


        public JsonResult UsersExport()
        {
            ExportRepository.ExportUsersDetails();
            return Json(new { data = ExportRepository.usersexportlist }, JsonRequestBehavior.AllowGet);
            
        }
    }
}