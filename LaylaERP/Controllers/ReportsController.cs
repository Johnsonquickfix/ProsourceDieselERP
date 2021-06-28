using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using LaylaERP.BAL;

namespace LaylaERP.Controllers
{
    public class ReportsController : Controller
    {
        // GET: Reports
        public ActionResult Index()
        {
            return View("AJBaseReport");
        }

        // GET: RoleBaseReport
        public ActionResult RoleBaseReport()
        {
            return View();
        }
        public ActionResult AJBaseReport()
        {
            return View();
        }
        public ActionResult ArizonaSalesOrderExport()
        {
            return View();
        }
        public ActionResult ZeroOrdersReport()
        {
            return View();
        }
        public ActionResult PodiumOrderReport()
        {
            return View();
        }
        [HttpPost]
        public ActionResult GetAjBaseData(string Month, string Year)
        {
            var from_date = new DateTime(Convert.ToInt32(Year), Convert.ToInt32(Month), 1);
            var to_date = from_date.AddMonths(1).AddDays(-1);

            ReportsRepository.GetAjBaseData(from_date.ToString(), to_date.ToString());
            var k = Json(new { data = ReportsRepository.exportorderlist }, JsonRequestBehavior.AllowGet);
            k.MaxJsonLength = int.MaxValue;
            return k;
        }
        [HttpPost]
        public ActionResult GetArizonaSalesOrder(string Year)
        {
           // var from_date = new DateTime(Convert.ToInt32(Year), Convert.ToInt32(Month), 1);
            //var to_date = from_date.AddMonths(1).AddDays(-1);

            DateTime from_date = new DateTime(Convert.ToInt32(Year), 1, 1);
            DateTime to_date = new DateTime(Convert.ToInt32(Year), 12, 31);

            ReportsRepository.GetArizonaSalesOrder(from_date.ToString(), to_date.ToString());
            var k = Json(new { data = ReportsRepository.exportorderlist }, JsonRequestBehavior.AllowGet);
            k.MaxJsonLength = int.MaxValue;
            return k;
        }

        [HttpPost]
        public ActionResult GetZeroOrder(string Month, string Year)
        {
            var from_date = new DateTime(Convert.ToInt32(Year), Convert.ToInt32(Month), 1);
            var to_date = from_date.AddMonths(1).AddDays(-1);

            ReportsRepository.GetZeroOrder(from_date.ToString(), to_date.ToString());
            var k = Json(new { data = ReportsRepository.exportorderlist }, JsonRequestBehavior.AllowGet);
            k.MaxJsonLength = int.MaxValue;
            return k;
        }
        [HttpPost]
        public ActionResult GetPodiumOrder(string Month, string Year)
        {
            var from_date = new DateTime(Convert.ToInt32(Year), Convert.ToInt32(Month), 1);
            var to_date = from_date.AddMonths(1).AddDays(-1);

            ReportsRepository.GetPodiumOrder(from_date.ToString(), to_date.ToString());
            var k = Json(new { data = ReportsRepository.exportorderlist }, JsonRequestBehavior.AllowGet);
            k.MaxJsonLength = int.MaxValue;
            return k;
        }
    }
}