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
    using System.Data;

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
        [Route("quote/quote-counts")]
        public JsonResult GetQuoteOrdersCount(SearchModel model)
        {
            string result = string.Empty;
            try
            {
                DateTime? fromdate = null, todate = null;
                if (!string.IsNullOrEmpty(model.strValue1)) fromdate = Convert.ToDateTime(model.strValue1);
                if (!string.IsNullOrEmpty(model.strValue2)) todate = Convert.ToDateTime(model.strValue2);
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                DataTable dt = OrderQuoteRepository.QuoteCounts(fromdate, todate, om.UserID);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }
        [HttpGet]
        [Route("quote/quote-list")]
        public JsonResult GetQuoteOrderList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DateTime? fromdate = null, todate = null;
                if (!string.IsNullOrEmpty(model.strValue1))
                    fromdate = Convert.ToDateTime(model.strValue1);
                if (!string.IsNullOrEmpty(model.strValue2))
                    todate = Convert.ToDateTime(model.strValue2);
                long customerid = 0;
                if (!string.IsNullOrEmpty(model.strValue3))
                    customerid = Convert.ToInt64(model.strValue3);

                //DataTable dt = OrderRepository.OrderList(model.strValue1, model.strValue2, model.strValue3, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                DataTable dt = OrderQuoteRepository.QuoteList(fromdate, todate, customerid, model.strValue4, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, aaData = result }, 0);
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