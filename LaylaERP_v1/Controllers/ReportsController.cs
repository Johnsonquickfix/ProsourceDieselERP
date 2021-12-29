using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using LaylaERP.BAL;
using LaylaERP.Models;
using Newtonsoft.Json;

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
        public ActionResult CommissionEarnAgent()
        {
            return View();
        }
        public ActionResult OrderType()
        {
            return View();
        }
        public ActionResult SalesRepresentative()
        {
            return View();
        }
        public ActionResult PartialRefund()
        {
            return View();
        }
        public ActionResult OrderTotalChart()
        {
            return View();
        }
        public ActionResult QuarterlyChart()
        {
            return View();
        }
        public ActionResult MonthlyChart()
        {
            return View();
        }
        public ActionResult YearMonthlyChart()
        {
            return View();
        }
        public ActionResult QuarterlyComparChart()
        {
            return View();
        }
        public ActionResult SalesBarChart()
        {
            return View();
        }
        public ActionResult CancelRefund()
        {
            return View();
        }

        public ActionResult Searchcouponorders()
        {
            return View();
        }

        public ActionResult WalmartReport()
        {
            return View();
        }
        public ActionResult WisconsinReport()
        {
            return View();
        }
        public ActionResult IDMeOrderReport()
        {
            return View();
        }
        public ActionResult ForecastSalesMonthly()
        {
            return View();
        }
        public ActionResult ForecastSalesQuarterly()
        {
            return View();
        }
        public ActionResult ForecastSalesLSR()
        {
            return View();
        }
        public ActionResult PeriodCalculateChart()
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


        [HttpPost]   
        public JsonResult GetCouponList(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable DT = ReportsRepository.GetProductList(model.strValue1);
                JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        [HttpPost]
        public ActionResult GetPodiumOrderDetails(string Month, string Year)
        {
            //string[] to = Year.Split('/');
            //int year, month, day;

            //int.TryParse(to[1], out day);
            //int.TryParse(to[0], out month);
            //int.TryParse(to[2], out year);
            //string today = "";
            //string tomonth = "";
            //if (day.ToString().Length == 1)
            //    today = "0" + day.ToString();           
            //else
            //    today = day.ToString();

            //if (month.ToString().Length == 1)
            //    tomonth = "0" + month.ToString();
            //else
            //    tomonth = month.ToString();

            //string to_date = today.ToString() + "/"  + tomonth.ToString() + "/" + year.ToString();

            //string[] from = Month.Split('/');
            //int yearf, monthf, dayf;
            //string fromday = "";
            //string fromonth = "";
            //int.TryParse(from[1], out dayf);
            //int.TryParse(from[0], out monthf);
            //int.TryParse(from[2], out yearf);

            //if (dayf.ToString().Length == 1)
            //    fromday = "0" + dayf.ToString();
            //else
            //    fromday = dayf.ToString();

            //if (monthf.ToString().Length == 1)
            //    fromonth = "0" + monthf.ToString();
            //else
            //    fromonth = monthf.ToString();


            //string from_date = fromday.ToString() + "/" + fromonth.ToString() + "/" + yearf.ToString();

            //DateTime from = DateTime.ParseExact(Year, "dd/MM/yyyy", null);

            // DateTime BirthDate = DateTime.ParseExact(Year.ToString(), "dd/MM/yyyy", CultureInfo.InvariantCulture);

            //cmd.Parameters.Add(DataAccess.CreateParameter(cmd, "@DateofBirth", DbType.DateTime, dob));

            //var from_date = new DateTime(Convert.ToInt32(Year), Convert.ToInt32(Month), 1);
            //var to_date = from_date.AddMonths(1).AddDays(-1);
            // string from_date = Convert.ToDateTime("07/01/2021").ToString("dd/MM/yyyy");
            //string to_date = Convert.ToDateTime("07/31/2021").ToString("dd/MM/yyyy");


            ReportsRepository.GetPodiumOrderDetails(Month, Year);
            var k = Json(new { data = ReportsRepository.exportorderlist }, JsonRequestBehavior.AllowGet);
            k.MaxJsonLength = int.MaxValue;
            return k;
        }


        public ActionResult GetPodiumEmployeeOrderDetails(string Month, string Year)
        {
            //string[] to = Year.Split('/');
            //int year, month, day;

            //int.TryParse(to[1], out day);
            //int.TryParse(to[0], out month);
            //int.TryParse(to[2], out year);
            //string today = "";
            //string tomonth = "";
            //if (day.ToString().Length == 1)
            //    today = "0" + day.ToString();
            //else
            //    today = day.ToString();

            //if (month.ToString().Length == 1)
            //    tomonth = "0" + month.ToString();
            //else
            //    tomonth = month.ToString();

            //string to_date = today.ToString() + "/" + tomonth.ToString() + "/" + year.ToString();

            //string[] from = Month.Split('/');
            //int yearf, monthf, dayf;
            //string fromday = "";
            //string fromonth = "";
            //int.TryParse(from[1], out dayf);
            //int.TryParse(from[0], out monthf);
            //int.TryParse(from[2], out yearf);

            //if (dayf.ToString().Length == 1)
            //    fromday = "0" + dayf.ToString();
            //else
            //    fromday = dayf.ToString();

            //if (monthf.ToString().Length == 1)
            //    fromonth = "0" + monthf.ToString();
            //else
            //    fromonth = monthf.ToString();


            //string from_date = fromday.ToString() + "/" + fromonth.ToString() + "/" + yearf.ToString();

            ReportsRepository.GetPodiumEmployeeOrderDetails(Month, Year);
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
        public ActionResult GetMRF(string Month, string Year, string txtState)
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

        [HttpGet]
        public JsonResult GetPaymentStatusList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DateTime? fromdate = null, todate = null;
                if (!string.IsNullOrEmpty(model.strValue2))
                    fromdate = Convert.ToDateTime(model.strValue2);
                if (!string.IsNullOrEmpty(model.strValue3))
                    todate = Convert.ToDateTime(model.strValue3);

                DataTable dt = ReportsRepository.GetPaymentStatusList(model.strValue1, model.strValue4, fromdate, todate, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }


        public ActionResult GetStatusDetails(string Month, string Year, string Type)
        {


            ReportsRepository.GetStatusDetails(Month, Year, Type);
            var k = Json(new { data = ReportsRepository.exportorderlist }, JsonRequestBehavior.AllowGet);
            k.MaxJsonLength = int.MaxValue;
            return k;
        }

        public ActionResult Getcouponcodesearch(string Month, string Year, string Type)
        {


            ReportsRepository.Getcouponcodesearch(Month, Year, Type);
            var k = Json(new { data = ReportsRepository.exportorderlist }, JsonRequestBehavior.AllowGet);
            k.MaxJsonLength = int.MaxValue;
            return k;
        }

        public JsonResult GetEmployee(SearchModel model)
        {
            DataSet ds = ReportsRepository.GetEmployee();
            List<SelectListItem> productlist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                productlist.Add(new SelectListItem { Text = dr["user_login"].ToString(), Value = dr["ID"].ToString() });
            }
            return Json(productlist, JsonRequestBehavior.AllowGet);
        }
        public ActionResult GetSalesDetails(string Month, string Year, string Type)
        {


            ReportsRepository.GetSalesDetails(Month, Year, Type);
            var k = Json(new { data = ReportsRepository.exportorderlist }, JsonRequestBehavior.AllowGet);
            k.MaxJsonLength = int.MaxValue;
            return k;
        }
        public ActionResult GetPartialRefund(string Month, string Year, string Type)
        {
            ReportsRepository.GetPartialRefund(Month, Year, Type);
            var k = Json(new { data = ReportsRepository.exportorderlist }, JsonRequestBehavior.AllowGet);
            k.MaxJsonLength = int.MaxValue;
            return k;
        }
        public ActionResult GetStatusOrder(string Month, string Year, string Type)
        {
            ReportsRepository.GetStatusOrder(Month, Year, Type);
            var k = Json(new { data = ReportsRepository.exportorderlist }, JsonRequestBehavior.AllowGet);
            k.MaxJsonLength = int.MaxValue;
            return k;
        }
        public ActionResult GetGrafixDetails(string Month, string Year, string Type)
        {


            ReportsRepository.GetGrafixDetails(Month, Year, Type);
            var k = Json(new { data = ReportsRepository.exportorderlist }, JsonRequestBehavior.AllowGet);
            k.MaxJsonLength = int.MaxValue;
            return k;
        }
        public JsonResult GetPeriodChart(string Month, string Year, string Type)
        {
            ReportsRepository.GetPeriodChart(Month, Year, Type);
            var list = ReportsRepository.exportorderlist;
            return Json(list.ToList(), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetText(string Month, string Year, string Type)
        {
            ReportsRepository.GetGrafixDetails(Month, Year, Type);
            var list = ReportsRepository.exportorderlist;
            return Json(list.ToList(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetQuarerly(string Month, string Year, string Type)
        {
            string result = string.Empty;
            DataTable dt = ReportsRepository.GetQuarerly(Month, Year, Type);
    
            //return Json(list.ToList(), JsonRequestBehavior.AllowGet);
            result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            return Json(result, 0);
        }
        public JsonResult GetMonthly(string Month, string Year, string Type)
        {
            string result = string.Empty;
            DataTable dt = ReportsRepository.GetMonthly(Month, Year, Type);

            //return Json(list.ToList(), JsonRequestBehavior.AllowGet);
            result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            return Json(result, 0);
        }
        public JsonResult GetMonthlyYear(string Month, string Year, string Type)
        {
            ReportsRepository.GetMonthlyYear(Month, Year, Type);
            var list = ReportsRepository.exportorderlist;
            return Json(list.ToList(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetQuarterlyYear(string Month, string Year, string Type)
        {
            ReportsRepository.GetQuarterlyYear(Month, Year, Type);
            var list = ReportsRepository.exportorderlist;
            return Json(list.ToList(), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetGrafixDetailData(string Month, string Year)
        {
            string result = string.Empty;
            try
            {
                DataTable dt = ReportsRepository.GetGrafixDetail(Month, Year, "");
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }


        [HttpPost]
        public JsonResult GetGrafixDetailsList(string Month, string Year, string Type)
        {
            List<ReportsModel> obj = new List<ReportsModel>();
            try
            {
                obj = ReportsRepository.GetProductListDetails(Month, Year, Type);
            }
            catch { }
            return Json(obj, 0);
        }

        [HttpGet]

        public JsonResult GetWalmartDetailsList(JqDataTableModel model)
        {
            string result = string.Empty;
            try
            {
                DateTime? fromdate = null, todate = null;
                if (!string.IsNullOrEmpty(model.strValue1))
                    fromdate = Convert.ToDateTime(model.strValue1);
                if (!string.IsNullOrEmpty(model.strValue2))
                    todate = Convert.ToDateTime(model.strValue2);
                DataTable dt = ReportsRepository.GetWalmartDetailsList(fromdate, todate, model.sSearch, model.strValue2, model.strValue3);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }

        [HttpPost]
        public JsonResult GetWalmartdetailsdata(JqDataTableModel model)
        {
            string result = string.Empty;
            try
            {
                DataTable dt = ReportsRepository.GetWalmartdetailsdata(model.strValue1, model.strValue2, model.strValue3);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }


        [HttpPost]
        public ActionResult GetWisconsinSalesOrder(string Year)
        {
            DateTime from_date = new DateTime(Convert.ToInt32(Year), 1, 1);
            DateTime to_date = new DateTime(Convert.ToInt32(Year), 12, 31);

            ReportsRepository.GetWisconsinSalesOrder(from_date.ToString(), to_date.ToString());
            var k = Json(new { data = ReportsRepository.exportorderlist }, JsonRequestBehavior.AllowGet);
            k.MaxJsonLength = int.MaxValue;
            return k;
        }
        [HttpPost]
        public ActionResult GetIDMeOrderReport(string Month, string Year, string Type)
        {
            ReportsRepository.GetIDMeOrderReport(Month, Year, Type);
            var k = Json(new { data = ReportsRepository.exportorderlist }, JsonRequestBehavior.AllowGet);
            k.MaxJsonLength = int.MaxValue;
            return k;
        }

        [HttpPost]
        public ActionResult GetForecastSalesMonthly(string Year)
        {
            ReportsRepository.GetForecastSalesMonthly(Year);
            var k = Json(new { data = ReportsRepository.exportorderlist }, JsonRequestBehavior.AllowGet);
            k.MaxJsonLength = int.MaxValue;
            return k;
        }

        public JsonResult GetForecastSalesMonthlyChart(string Year)
        {
            ReportsRepository.GetForecastSalesMonthlyChart(Year);
            var list = ReportsRepository.exportorderlistchart;
            return Json(list.ToList(), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult exportwalmartlist(JqDataTableModel model)
        {
            string result = string.Empty;
            try
            {
                DateTime? fromdate = null, todate = null;
                if (!string.IsNullOrEmpty(model.strValue5))
                    fromdate = Convert.ToDateTime(model.strValue5);
                if (!string.IsNullOrEmpty(model.strValue6))
                    todate = Convert.ToDateTime(model.strValue6);
                DataSet ds = ReportsRepository.exportwalmartlist(fromdate, todate, model.sSearch, model.strValue2, model.strValue3);
               // DataSet ds = InventoryRepository.exportProductStock(model.strValue1, model.strValue2, model.strValue3, model.strValue4, fromdate, todate);
                result = JsonConvert.SerializeObject(ds, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }

        [HttpPost]
        public ActionResult GetForecastSalesQuarterly(string Year)
        {
            ReportsRepository.GetForecastSalesQuarterly(Year);
            var k = Json(new { data = ReportsRepository.exportorderlist }, JsonRequestBehavior.AllowGet);
            k.MaxJsonLength = int.MaxValue;
            return k;
        }
        public JsonResult GetForecastSalesQuarterlyChart(string Year)
        {
            ReportsRepository.GetForecastSalesQuarterlyChart(Year);
            var list = ReportsRepository.exportorderlistchart;
            return Json(list.ToList(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetForecastSalesLSR(string year)
        {
            string result = string.Empty;
            try
            {
                DataTable dt = ReportsRepository.GetForecastSalesLSR(year);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }
    }
         
}