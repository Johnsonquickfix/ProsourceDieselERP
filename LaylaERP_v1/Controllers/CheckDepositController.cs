using LaylaERP.BAL;
using LaylaERP.Models;
using LaylaERP.UTILITIES;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LaylaERP_v1.Controllers
{
    public class CheckDepositController : Controller
    {
        // GET: CheckDeposit
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult CheckDepositList()
        {
            return View();
        }

        public ActionResult PaymentStatusList()
        {
            return View();
        }

        public ActionResult CheckDepositPayment()
        {
            return View();
        }
        public ActionResult AddnewCheck(long id = 0)
        {
            clsUserDetails model = new clsUserDetails();
            ViewBag.id = id;
            return View(model);
        }

        [HttpGet]
        public JsonResult GetCheckDepositList(JqDataTableModel model)
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
               
                DataTable dt = PaymentInvoiceRepository.GetCheckDepositList(model.strValue1, model.strValue4, fromdate, todate, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
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

                DataTable dt = PaymentInvoiceRepository.GetPaymentStatusList(model.strValue1, model.strValue4, fromdate, todate, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }
        [HttpGet]
        public JsonResult GetCheckClearedDepositList(JqDataTableModel model)
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

                DataTable dt = PaymentInvoiceRepository.GetCheckClearedDepositList(model.strValue1, model.strValue4, fromdate, todate, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }
        [HttpGet]
        public JsonResult GetDataByID(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataSet ds = new DataSet();
                ds = PaymentInvoiceRepository.GetDataByID(model.strValue2);
                JSONresult = JsonConvert.SerializeObject(ds);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        [HttpPost]
        public JsonResult Paymenttobank(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                long id = 0, u_id = 0;
                if (!string.IsNullOrEmpty(model.strValue1)) id = Convert.ToInt64(model.strValue1);
                u_id = CommanUtilities.Provider.GetCurrent().UserID;
                UserActivityLog.WriteDbLog(LogType.Submit, "Bank Settlement Process", "/CheckDeposit/CheckDepositPayment/" + id + "" + ", " + Net.BrowserInfo);
                System.Xml.XmlDocument orderXML = JsonConvert.DeserializeXmlNode("{\"Data\":" + model.strValue2 + "}", "Items");
                System.Xml.XmlDocument orderdetailsXML = JsonConvert.DeserializeXmlNode("{\"Data\":" + model.strValue3 + "}", "Items");
                JSONresult = JsonConvert.SerializeObject(PaymentInvoiceRepository.Paymenttobank(id, "PYV", u_id, orderXML, orderdetailsXML));
            }
            catch { }
            return Json(JSONresult, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult RejectAmount(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                long id = 0; //, u_id = 0;
                if (!string.IsNullOrEmpty(model.strValue1)) id = Convert.ToInt64(model.strValue1);
                JSONresult = JsonConvert.SerializeObject(PaymentInvoiceRepository.AmountStatusChange(id, "RPV'"));
            }
            catch { }
            return Json(JSONresult, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult CheckCleare(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                long id = 0; //, u_id = 0;
                if (!string.IsNullOrEmpty(model.strValue1)) id = Convert.ToInt64(model.strValue1);
                JSONresult = JsonConvert.SerializeObject(PaymentInvoiceRepository.CheckCleare(id, "CHC'"));
            }
            catch { }
            return Json(JSONresult, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult ClearedAmount(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                long id = 0;
                if (!string.IsNullOrEmpty(model.strValue1)) id = Convert.ToInt64(model.strValue1);
                JSONresult = JsonConvert.SerializeObject(PaymentInvoiceRepository.AmountStatusChange(id, "VPV'"));
            }
            catch { }
            return Json(JSONresult, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetClearedDataList(JqDataTableModel model)
        {
            string result = string.Empty;
            try
            {
                long id = 0;
                if (!string.IsNullOrEmpty(model.strValue1))
                    id = Convert.ToInt64(model.strValue1);
                DataTable dt = PaymentInvoiceRepository.GetClearedDataList(id);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }

        [HttpGet]
        public JsonResult GetCheckDepositPrint(SearchModel model)
        {
            string JSONresult = string.Empty;
            OperatorModel om = CommanUtilities.Provider.GetCurrent();
            try
            {
                long id = 0;
                if (!string.IsNullOrEmpty(model.strValue1))
                    id = Convert.ToInt64(model.strValue1);
                DataSet ds = PaymentInvoiceRepository.GetCheckDepositPrint(id);
                JSONresult = JsonConvert.SerializeObject(ds);
            }
            catch { }
            return Json(new { com_name = om.CompanyName, add = om.address, add1 = om.address1, city = om.City, state = om.State, zip = om.postal_code, country = om.Country, phone = om.user_mobile, email = om.email, website = om.website, data = JSONresult }, 0);
        }

        [HttpGet]
        public JsonResult PurchaseSalesPrint(SearchModel model)
        {
            string JSONresult = string.Empty;
            OperatorModel om = CommanUtilities.Provider.GetCurrent();
            try
            {
                long id = 0;
                if (!string.IsNullOrEmpty(model.strValue1))
                    id = Convert.ToInt64(model.strValue1);
                DataSet ds = PaymentInvoiceRepository.PurchaseSalesPrint(id);
                JSONresult = JsonConvert.SerializeObject(ds);
            }
            catch { }
            return Json(new { com_name = om.CompanyName, add = om.address, add1 = om.address1, city = om.City, state = om.State, zip = om.postal_code, country = om.Country, phone = om.user_mobile, email = om.email, website = om.website, data = JSONresult }, 0);
        }

        public JsonResult GetGrandTotal(JqDataTableModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DateTime? fromdate = null, todate = null;
                if (!string.IsNullOrEmpty(model.strValue2))
                    fromdate = Convert.ToDateTime(model.strValue2);
                if (!string.IsNullOrEmpty(model.strValue3))
                    todate = Convert.ToDateTime(model.strValue3);

                DataTable dt = PaymentInvoiceRepository.GetGrandTotal(model.strValue1, fromdate, todate,model.strValue4, model.strValue5);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        [HttpGet]
        public JsonResult CheckReconciliationList(JqDataTableModel model)
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

                DataTable dt = PaymentInvoiceRepository.CheckReconciliationList(model.strValue1, model.strValue4, fromdate, todate, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }

        public JsonResult Verifystatus(string strValue1, string strValue2, string strValue3)
        {
            string JSONResult = string.Empty;
            DataTable dt = new DataTable();
            try
            {
                DateTime? fromdate = null, todate = null;
                if (!string.IsNullOrEmpty(strValue2))
                    fromdate = Convert.ToDateTime(strValue2);
                if (!string.IsNullOrEmpty(strValue3))
                    todate = Convert.ToDateTime(strValue3);
                dt = PaymentInvoiceRepository.Verifystatus(strValue1, fromdate, todate);
                JSONResult = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Json(JSONResult, 0);
        }

        [HttpPost]
        public JsonResult Rejectcheck(CustomerModel model)
        {
            string strID = model.strVal;
            if (strID != "")
            {
                PaymentInvoiceRepository.Rejectcheck(model);
                return Json(new { status = true, message = "Check status change successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Something went wrong", url = "" }, 0);
            }

        }
        [HttpPost]
        public JsonResult Reconcile(CustomerModel model)
        {
            string strID = model.strVal;
            if (strID != "")
            {
               PaymentInvoiceRepository.Reconcile(model);
                return Json(new { status = true, message = "Check reconcile successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Something went wrong", url = "" }, 0);
            }

        }

        public JsonResult Reconcilestatus(string strValue1, string strValue2)
        {
            string JSONResult = string.Empty;
            DataTable dt = new DataTable();
            try
            { 
                dt = PaymentInvoiceRepository.Reconcilestatus(strValue1, strValue2);
                JSONResult = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Json(JSONResult, 0);
        }
    }
}