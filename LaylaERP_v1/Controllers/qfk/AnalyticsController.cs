namespace LaylaERP.Controllers.qfk
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;
    using System.Web.Mvc;
    using System.Data;
    using System.Data.SqlClient;
    using LaylaERP.UTILITIES;
    using LaylaERP.BAL.qfk;

    public class AnalyticsController : Controller
    {
        // GET: Analytics
        public ActionResult Metrics()
        {
            return View();
        }
        public ActionResult Metric(string id = "")
        {
            DataTable table = new DataTable();
            try
            {
                ViewBag.id = id;
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                //table = ProfilesRepository.MetricsList(om.company_id, String.Empty, 0, 1000, "metric_name", "asc");
                table = ProfilesRepository.MetricsList(1, String.Empty, 0, 1000, "metric_name", "asc");
            }
            catch { }

            return View(table);
        }

        public ActionResult Activity(string id = "")
        {
            DataTable table = new DataTable();
            try
            {
                ViewBag.id = id;
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                //table = ProfilesRepository.MetricsList(om.company_id, String.Empty, 0, 1000, "metric_name", "asc");
                table = ProfilesRepository.MetricsList(1, String.Empty, 0, 1000, "metric_name", "asc");
            }
            catch { }

            return View(table);
        }
        public ActionResult Index()
        {
            return View();
        }
    }
}