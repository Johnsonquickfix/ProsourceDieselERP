using System;
using System.Collections.Generic;
using System.Data;
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
        public ActionResult MRFReport()
        {
            return View();
        }
        public ActionResult MattressAverageOrderValueReport()
        {
            return View();
        }
        public ActionResult TaxJarSalesTaxOrderExport()
        {
            return View();
        }
        public ActionResult SalesTaxRefundReport()
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

        public JsonResult GetState()
        {
            DataTable dt = new DataTable();
            dt = ReportsRepository.GetState();
            List<SelectListItem> usertype = new List<SelectListItem>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                usertype.Add(new SelectListItem
                {
                    Value = dt.Rows[i]["State"].ToString(),
                    Text = dt.Rows[i]["StateFullName"].ToString()

                });
            }
            return Json(usertype, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetTaxableState()
        {
            DataTable dt = new DataTable();
            dt = ReportsRepository.GetTaxableState();
            List<SelectListItem> usertype = new List<SelectListItem>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                usertype.Add(new SelectListItem
                {
                    Value = dt.Rows[i]["State"].ToString(),
                    Text = dt.Rows[i]["StateFullName"].ToString()

                });
            }
            return Json(usertype, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetSaleTaxState()
        {
            DataTable dt = new DataTable();
            dt = ReportsRepository.GetSaleTaxState();
            List<SelectListItem> usertype = new List<SelectListItem>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                usertype.Add(new SelectListItem
                {
                    Value = dt.Rows[i]["State"].ToString(),
                    Text = dt.Rows[i]["StateFullName"].ToString()

                });
            }
            return Json(usertype, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult GetMRF(string Month, string Year,string txtState)
        {
            var from_date = new DateTime(Convert.ToInt32(Year), Convert.ToInt32(Month), 1);
            var to_date = from_date.AddMonths(1).AddDays(-1);

            ReportsRepository.GetMRF(from_date.ToString(), to_date.ToString(), txtState);
            var k = Json(new { data = ReportsRepository.exportorderlist }, JsonRequestBehavior.AllowGet);
            k.MaxJsonLength = int.MaxValue;
            return k;
        }
        [HttpPost]
        public ActionResult GetMattress(string Month, string Year, string txtStatus)
        {
            var from_date = new DateTime(Convert.ToInt32(Year), Convert.ToInt32(Month), 1);
            var to_date = from_date.AddMonths(1).AddDays(-1);

            ReportsRepository.GetMattress(from_date.ToString(), to_date.ToString(), txtStatus);
            var k = Json(new { data = ReportsRepository.exportorderlist }, JsonRequestBehavior.AllowGet);
            k.MaxJsonLength = int.MaxValue;
            return k;
        }
        [HttpPost]
        public ActionResult GetTaxJarOrder(string Month, string Year, string txtState)
        {
            var from_date = new DateTime(Convert.ToInt32(Year), Convert.ToInt32(Month), 1);
            var to_date = from_date.AddMonths(1).AddDays(-1);

            ReportsRepository.GetTaxJarOrder(from_date.ToString(), to_date.ToString(), txtState);
            var k = Json(new { data = ReportsRepository.exportorderlist }, JsonRequestBehavior.AllowGet);
            k.MaxJsonLength = int.MaxValue;
            return k;
        }

        [HttpPost]
        public ActionResult GetSalesTaxRefunded(string Month, string Year, string txtState)
        {
            var from_date = new DateTime(Convert.ToInt32(Year), Convert.ToInt32(Month), 1);
            var to_date = from_date.AddMonths(1).AddDays(-1);

            ReportsRepository.GetSalesTaxRefunded(from_date.ToString(), to_date.ToString(), txtState);
            var k = Json(new { data = ReportsRepository.exportorderlist }, JsonRequestBehavior.AllowGet);
            k.MaxJsonLength = int.MaxValue;
            return k;
        }
    }
}