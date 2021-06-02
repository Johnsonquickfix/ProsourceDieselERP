namespace LaylaERP.Controllers
{
    using LaylaERP.UTILITIES;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;
    using System.Web.Mvc;
    using System.Data;
    using LaylaERP.Models;
    using Newtonsoft.Json;
    using System.Globalization;

    public class HomeController : Controller
    {
        public ActionResult Login()
        {
            CommanUtilities.Provider.RemoveCurrent();
            return View();
        }
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Dashboard()
        {   ViewBag.totalorders = BAL.DashboardRepository.Total_Orders();
            ViewBag.totalsales = BAL.DashboardRepository.Total_Sales();
            ViewBag.totalcustomers = BAL.DashboardRepository.Total_Customer();
            ViewBag.totalordercompleted = BAL.DashboardRepository.Total_Order_Completed();
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}