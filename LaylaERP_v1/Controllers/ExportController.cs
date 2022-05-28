using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using LaylaERP.Models;
using LaylaERP.BAL;
using Newtonsoft.Json;
//using System.Web.Script.Serialization;

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
        public ActionResult GetData(string from_date, string to_date, string user)
        {
            ExportRepository.ExportOrderDetails(from_date, to_date, user);
            var k = Json(new { data = ExportRepository.exportorderlist }, JsonRequestBehavior.AllowGet);
            k.MaxJsonLength = int.MaxValue;
            return k;
        }
        [HttpPost]
        public ActionResult GetOrderData(string from_date, string to_date, string user, string status)
        {
            ExportRepository.GetOrderData(from_date, to_date, user, status);
            var k = Json(new { data = ExportRepository.exportorderlist }, JsonRequestBehavior.AllowGet);
            k.MaxJsonLength = int.MaxValue;
            return k;
        }

        [HttpPost]
        public JsonResult UsersExport(string from_dateusers, string to_dateusers, string rolee)
        {
            if (rolee == "")
            {
                rolee = "NULL";
            }
            //ExportRepository.myexport();
            ExportRepository.ExportUsersDetails(from_dateusers, to_dateusers, rolee);
            var j = Json(new { data = ExportRepository.usersexportlist }, JsonRequestBehavior.AllowGet);
            j.MaxJsonLength = int.MaxValue;
            return j;

        }


        public JsonResult CustomersExport(string from_datecustomers, string to_datecustomers)
        {
            ExportRepository.ExportCustomersDetails(from_datecustomers, to_datecustomers);
            var j = Json(new { data = ExportRepository.customersexportlist }, JsonRequestBehavior.AllowGet);
            j.MaxJsonLength = int.MaxValue;
            return j;
            
        }

        public JsonResult GetUserRoles()
        {
            DataTable dt = new DataTable();
            dt = BAL.ExportRepository.GetUserRoles();
            List<SelectListItem> usertype = new List<SelectListItem>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                usertype.Add(new SelectListItem
                {
                    Value = dt.Rows[i]["user_value"].ToString(),
                    Text = dt.Rows[i]["user_type"].ToString()

                });
            }
            return Json(usertype, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Export1()
        {
            return View();
        }
    }
}