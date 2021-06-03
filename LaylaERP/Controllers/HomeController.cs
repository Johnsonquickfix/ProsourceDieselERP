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
        {
            CultureInfo us = new CultureInfo("en-US");
            ViewBag.totalorders = Convert.ToDecimal(BAL.DashboardRepository.Total_Orders()).ToString("N0",us); //BAL.DashboardRepository.Total_Orders();
            ViewBag.totalsales = Convert.ToDecimal(BAL.DashboardRepository.Total_Sales()).ToString("N2",us);
            ViewBag.totalcustomers = Convert.ToDecimal(BAL.DashboardRepository.Total_Customer()).ToString("N0",us);
            ViewBag.totalordercompleted = Convert.ToDecimal(BAL.DashboardRepository.Total_Order_Completed()).ToString("N0",us);
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