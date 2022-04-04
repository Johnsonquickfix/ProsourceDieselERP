namespace LaylaERP.Controllers
{
    using UTILITIES;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;
    using System.Web.Mvc;

    public class OrderQuoteController : Controller
    {
        // GET: OrderQuote
        public ActionResult Index(long id = 0)
        {
            ViewBag.id = id;
            string pay_method = CommanUtilities.Provider.GetCurrent().Podium ? "{\"id\":\"podium\" ,\"text\":\"Podium\"}" : "";
            ViewBag.pay_option = "[" + pay_method + "]";
            return View();
        }
        // GET: OrderQuote
        public ActionResult History()
        {
            return View();
        }
    }
}