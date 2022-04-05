namespace LaylaERP.Controllers
{
    using UTILITIES;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;
    using System.Web.Mvc;
    using Newtonsoft.Json;
    using LaylaERP.BAL;
    using LaylaERP.Models;

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

        [HttpPost]
        public JsonResult CreateQuote(OrderQuoteModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                if (string.IsNullOrEmpty(model.quote_header))
                {
                    return Json("[{\"response\":\"Please select customer info.\",\"id\":0}]", JsonRequestBehavior.AllowGet);
                }
                if (string.IsNullOrEmpty(model.quote_product))
                {
                    return Json("[{\"response\":\"Your cart is empty. Please add products in cart.\",\"id\":0}]", JsonRequestBehavior.AllowGet);
                }
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                JSONresult = JsonConvert.SerializeObject(OrderQuoteRepository.AddOrdersQuote(model.id, om.UserID, model.quote_header, model.quote_product));
            }
            catch { }
            return Json(JSONresult, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public JsonResult GetQuoteDetails(OrderQuoteModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                JSONresult = JsonConvert.SerializeObject(OrderQuoteRepository.GetOrdersQuote(model.id));
            }
            catch { }
            return Json(JSONresult, JsonRequestBehavior.AllowGet);
        }
    }
}