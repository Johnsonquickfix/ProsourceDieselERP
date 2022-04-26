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

namespace LaylaERP.Controllers
{
    public class PaymentInvoiceController : Controller
    {
        // GET: PaymentInvoice
        public ActionResult PaymentInvoiceList()
        {
            return View();
        }
        public ActionResult PaymentInvoice()
        {
            return View();
        }
        public ActionResult PaymentInvoiceSO()
        {
            return View();
        }
        public ActionResult PaymentInvoiceListSO()
        {
            return View();
        }
        public ActionResult PaymentSOInvoiceList()
        {
            return View();
        }
        public ActionResult PayMiscBills()
        {
            return View();
        }
        public ActionResult PayMiscBillList()
        {
            return View();
        }
        public ActionResult PayBillsMisc()
        {
            return View();
        }
        public ActionResult PaymentInvoiceMiscBill()
        {
            return View();
        }

        public ActionResult PaymentChecklist()
        {
            return View();
        }

        [HttpGet]
        public JsonResult GetPurchaseOrderList(JqDataTableModel model)
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

                DataTable dt = PaymentInvoiceRepository.GetPurchaseOrder(model.strValue1, fromdate, todate, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }
        [HttpGet]
        public JsonResult GetPurchaseOrderListSO(JqDataTableModel model)
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

                DataTable dt = PaymentInvoiceRepository.GetPurchaseOrderListSO(model.strValue1, fromdate, todate, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }
        [HttpPost]
        public JsonResult GetPOOrderDataList(JqDataTableModel model)
        {
            string result = string.Empty;
            try
            {
                long id = 0;
                if (!string.IsNullOrEmpty(model.strValue1))
                    id = Convert.ToInt64(model.strValue1);
                DataTable dt = PaymentInvoiceRepository.GetPOOrderDataList(id);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }
        [HttpPost]
        public JsonResult GetPOOrderDataListSO(JqDataTableModel model)
        {
            string result = string.Empty;
            try
            {
                long id = 0;
                if (!string.IsNullOrEmpty(model.strValue1))
                    id = Convert.ToInt64(model.strValue1);
                DataTable dt = PaymentInvoiceRepository.GetPOOrderDataListSO(id);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }
        [HttpGet]
        public JsonResult GetPurchaseOrderByID(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataSet ds = new DataSet();
                ds = PaymentInvoiceRepository.GetPRPurchaseOrderByID(model.strValue2);
                //if (model.strValue1 == "PO")
                //    ds = PaymentInvoiceRepository.GetPRPurchaseOrderByID(model.strValue2);
                //else
                //    ds = PaymentInvoiceRepository.GetPurchaseOrderByID(model.strValue2);

                JSONresult = JsonConvert.SerializeObject(ds);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        [HttpGet]
        public JsonResult GetPurchaseOrderSOByID(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataSet ds = new DataSet();
                ds = PaymentInvoiceRepository.GetPurchaseOrderSOByID(model.strValue2);
                //if (model.strValue1 == "PO")
                //    ds = PaymentInvoiceRepository.GetPRPurchaseOrderByID(model.strValue2);
                //else
                //    ds = PaymentInvoiceRepository.GetPurchaseOrderByID(model.strValue2);

                JSONresult = JsonConvert.SerializeObject(ds);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        [HttpGet]
        public JsonResult GetPaymentType()
        {
            string result = string.Empty;
            try
            {
                DataSet DS = PaymentInvoiceRepository.GetPaymentType();
                result = JsonConvert.SerializeObject(DS, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }
        [HttpGet]
        public JsonResult GetTypePayment()
        {
            string result = string.Empty;
            try
            {
                DataSet DS = PaymentInvoiceRepository.GetTypePayment();
                result = JsonConvert.SerializeObject(DS, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }
        [HttpPost]
        public JsonResult TakePayment(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                long id = 0, u_id = 0;
                if (!string.IsNullOrEmpty(model.strValue1)) id = Convert.ToInt64(model.strValue1);
                UserActivityLog.WriteDbLog(LogType.Submit, "Pay Invoice Payment", "/PaymentInvoice/PaymentInvoice/" + id + "" + ", " + Net.BrowserInfo);
                u_id = CommanUtilities.Provider.GetCurrent().UserID;
                System.Xml.XmlDocument orderXML = JsonConvert.DeserializeXmlNode("{\"Data\":" + model.strValue2 + "}", "Items");
                System.Xml.XmlDocument orderdetailsXML = JsonConvert.DeserializeXmlNode("{\"Data\":" + model.strValue3 + "}", "Items");
                JSONresult = JsonConvert.SerializeObject(PaymentInvoiceRepository.AddNewPurchase(id, "POP", u_id, orderXML, orderdetailsXML));
            }
            catch { }
            return Json(JSONresult, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult Newcheckdeposit(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                long id = 0, u_id = 0;
                if (!string.IsNullOrEmpty(model.strValue1)) id = Convert.ToInt64(model.strValue1);
                UserActivityLog.WriteDbLog(LogType.Submit, "Check Deposit Bank", "/PaymentInvoice/Newcheckdeposit/" + id + "" + ", " + Net.BrowserInfo);
                u_id = CommanUtilities.Provider.GetCurrent().UserID;
                System.Xml.XmlDocument orderXML = JsonConvert.DeserializeXmlNode("{\"Data\":" + model.strValue2 + "}", "Items");
                System.Xml.XmlDocument orderdetailsXML = JsonConvert.DeserializeXmlNode("{\"Data\":" + model.strValue3 + "}", "Items");
                JSONresult = JsonConvert.SerializeObject(PaymentInvoiceRepository.Newcheckdeposit(id, "POP", u_id, orderXML, orderdetailsXML));
            }
            catch { }
            return Json(JSONresult, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [Route("PaymentInvoice/proposals-print")]
        public JsonResult GetProposalsPrint(SearchModel model)
        {
            string JSONresult = string.Empty;
            //OperatorModel om = CommanUtilities.Provider.GetCurrent();
            OperatorModel om = new OperatorModel();
            try
            {
                long id = 0;
                if (!string.IsNullOrEmpty(model.strValue1))
                    id = Convert.ToInt64(model.strValue1);
                DataSet ds = PaymentInvoiceRepository.GetSupplierProposalsDetails(id, "GETPNT");
                JSONresult = JsonConvert.SerializeObject(ds);
            }
            catch { }
            return Json(new { en_id = UTILITIES.CryptorEngine.Encrypt(model.strValue1), com_name = om.CompanyName, add = om.address, add1 = om.address1, city = om.City, state = om.State, zip = om.postal_code, country = om.Country, phone = om.user_mobile, email = om.email, website = om.website, data = JSONresult }, 0);
        }
        [HttpGet]
        [Route("PaymentInvoice/proposalsdetails-print")]
        public JsonResult GetProposalsdetailsPrint(SearchModel model)
        {
            string JSONresult = string.Empty;
            //OperatorModel om = CommanUtilities.Provider.GetCurrent();
            OperatorModel om = new OperatorModel();
            try
            {
                long id = 0;
                if (!string.IsNullOrEmpty(model.strValue1))
                    id = Convert.ToInt64(model.strValue1);
                DataSet ds = PaymentInvoiceRepository.GetProposalsdetailsPrint(id, "GETPNT");
                JSONresult = JsonConvert.SerializeObject(ds);
            }
            catch { }
            return Json(new { en_id = UTILITIES.CryptorEngine.Encrypt(model.strValue1), com_name = om.CompanyName, add = om.address, add1 = om.address1, city = om.City, state = om.State, zip = om.postal_code, country = om.Country, phone = om.user_mobile, email = om.email, website = om.website, data = JSONresult }, 0);
        }
        [HttpGet]
        [Route("PaymentInvoice/accountposalsdetails-print")]
        public JsonResult Getaccountposalsdetailsprint(SearchModel model)
        {
            string JSONresult = string.Empty;
            //OperatorModel om = CommanUtilities.Provider.GetCurrent();
            OperatorModel om = new OperatorModel();
            try
            {
                long id = 0;
                //if (!string.IsNullOrEmpty(model.strValue1))
                //    id = Convert.ToInt64(model.strValue1);
                DataSet ds = PaymentInvoiceRepository.Getaccountposalsdetailsprint(model.strValue1, "GETPNT");
                JSONresult = JsonConvert.SerializeObject(ds);
            }
            catch { }
            return Json(new { en_id = UTILITIES.CryptorEngine.Encrypt(model.strValue1), com_name = om.CompanyName, add = om.address, add1 = om.address1, city = om.City, state = om.State, zip = om.postal_code, country = om.Country, phone = om.user_mobile, email = om.email, website = om.website, data = JSONresult }, 0);
        }

        [HttpGet]
        public JsonResult GetPurchaseSOOrderList(JqDataTableModel model)
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

                DataTable dt = PaymentInvoiceRepository.GetPurchaseSOOrderList(model.strValue1, fromdate, todate, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }


        [HttpGet]
        public JsonResult GetPaymentInvoiceSOByID(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataSet ds = new DataSet();
                ds = PaymentInvoiceRepository.GetPaymentInvoiceSOByID(model.strValue2);
                //if (model.strValue1 == "PO")
                //    ds = PaymentInvoiceRepository.GetPRPurchaseOrderByID(model.strValue2);
                //else
                //    ds = PaymentInvoiceRepository.GetPurchaseOrderByID(model.strValue2);

                JSONresult = JsonConvert.SerializeObject(ds);
            }
            catch { }
            return Json(JSONresult, 0);
        }


        [HttpPost]
        public JsonResult TakePaymentSO(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                long id = 0, u_id = 0;
                if (!string.IsNullOrEmpty(model.strValue1)) id = Convert.ToInt64(model.strValue1);
                UserActivityLog.WriteDbLog(LogType.Submit, "Pay Invoice Payment", "/PaymentInvoice/TakePaymentSO/" + id + "" + ", " + Net.BrowserInfo);
                u_id = CommanUtilities.Provider.GetCurrent().UserID;
                System.Xml.XmlDocument orderXML = JsonConvert.DeserializeXmlNode("{\"Data\":" + model.strValue2 + "}", "Items");
                System.Xml.XmlDocument orderdetailsXML = JsonConvert.DeserializeXmlNode("{\"Data\":" + model.strValue3 + "}", "Items");
                JSONresult = JsonConvert.SerializeObject(PaymentInvoiceRepository.AddNewSOPayment(id, "POP", u_id, orderXML, orderdetailsXML));
            }
            catch { }
            return Json(JSONresult, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetPaymentDataListSO(JqDataTableModel model)
        {
            string result = string.Empty;
            try
            {
                long id = 0;
                if (!string.IsNullOrEmpty(model.strValue1))
                    id = Convert.ToInt64(model.strValue1);
                DataTable dt = PaymentInvoiceRepository.GetPaymentDataListSO(id);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }

        public JsonResult gettransactiontype(SearchModel model)
        {
            DataSet ds = BAL.PaymentInvoiceRepository.gettransactiontype();
            List<SelectListItem> productlist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                productlist.Add(new SelectListItem { Text = dr["Name"].ToString(), Value = dr["ID"].ToString() });
            }
            return Json(productlist, JsonRequestBehavior.AllowGet);

        }
        public JsonResult getpaymenttypefill(SearchModel model)
        {
            DataSet ds = BAL.PaymentInvoiceRepository.getpaymenttype();
            List<SelectListItem> productlist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                productlist.Add(new SelectListItem { Text = dr["Name"].ToString(), Value = dr["ID"].ToString() });
            }
            return Json(productlist, JsonRequestBehavior.AllowGet);

        }

        [HttpPost]
        public JsonResult NewMiscBill(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                long id = 0, u_id = 0;
                if (!string.IsNullOrEmpty(model.strValue1)) id = Convert.ToInt64(model.strValue1);
               // u_id = CommanUtilities.Provider.GetCurrent().UserID;
                System.Xml.XmlDocument orderXML = JsonConvert.DeserializeXmlNode("{\"Data\":" + model.strValue2 + "}", "Items");
                System.Xml.XmlDocument orderdetailsXML = JsonConvert.DeserializeXmlNode("{\"Data\":" + model.strValue3 + "}", "Items");
                JSONresult = JsonConvert.SerializeObject(PaymentInvoiceRepository.NewMiscBill(id, "I", orderXML, orderdetailsXML));

            }
            catch { }
            return Json(JSONresult, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [Route("PaymentInvoice/miscbill-print")]
        public JsonResult Getmiscbillprint(SearchModel model)
        {
            string JSONresult = string.Empty;
            //OperatorModel om = CommanUtilities.Provider.GetCurrent();
            OperatorModel om = new OperatorModel();
            try
            {
                long id = 0;
                if (!string.IsNullOrEmpty(model.strValue1))
                    id = Convert.ToInt64(model.strValue1);
                DataSet ds = PaymentInvoiceRepository.Getmiscbillprint(id, "GETPNT");
                JSONresult = JsonConvert.SerializeObject(ds);
            }
            catch { }
            return Json(new { en_id = UTILITIES.CryptorEngine.Encrypt(model.strValue1), com_name = om.CompanyName, add = om.address, add1 = om.address1, city = om.City, state = om.State, zip = om.postal_code, country = om.Country, phone = om.user_mobile, email = om.email, website = om.website, data = JSONresult }, 0);
        }

        [HttpPost]
        public JsonResult GetvendorAddress(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                long id = 0;
                if (!string.IsNullOrEmpty(model.strValue1))
                    id = Convert.ToInt64(model.strValue1);
                DataTable DT = PaymentInvoiceRepository.GetvendorAddress(id);
                JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        [HttpGet]
        [Route("paymentInvoice/paymiscList")]
        public JsonResult paymiscList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                int statusid = 0;
                DateTime? fromdate = null, todate = null;
                if (!string.IsNullOrEmpty(model.strValue1))
                    fromdate = Convert.ToDateTime(model.strValue1);
                if (!string.IsNullOrEmpty(model.strValue2))
                    todate = Convert.ToDateTime(model.strValue2);
                if (!string.IsNullOrEmpty(model.strValue3))
                    statusid = Convert.ToInt32(model.strValue3);
                DataTable dt = PaymentInvoiceRepository.paymiscList(fromdate, todate, statusid, model.strValue4, model.strValue5, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }
        [HttpGet]
        public JsonResult GetBillDetailByID(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                long id = 0;
                if (!string.IsNullOrEmpty(model.strValue1))
                    id = Convert.ToInt64(model.strValue1);
                DataSet ds = PaymentInvoiceRepository.GetBillDetailByID(id);
                JSONresult = JsonConvert.SerializeObject(ds);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        [HttpGet]
        public JsonResult GetPaymentMiscList(JqDataTableModel model)
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

                DataTable dt = PaymentInvoiceRepository.GetPaymentMiscList(model.strValue1, fromdate, todate, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }

        [HttpPost]
        public JsonResult GetPaymentBilldetails(JqDataTableModel model)
        {
            string result = string.Empty;
            try
            {
                long id = 0;
                if (!string.IsNullOrEmpty(model.strValue1))
                    id = Convert.ToInt64(model.strValue1);
                DataTable dt = PaymentInvoiceRepository.GetPaymentBilldetails(id);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }

        [HttpGet]
        public JsonResult GetPaymentMiscByID(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataSet ds = new DataSet();
                ds = PaymentInvoiceRepository.GetPaymentMiscByID(model.strValue2);
                //if (model.strValue1 == "PO")
                //    ds = PaymentInvoiceRepository.GetPRPurchaseOrderByID(model.strValue2);
                //else
                //    ds = PaymentInvoiceRepository.GetPurchaseOrderByID(model.strValue2);

                JSONresult = JsonConvert.SerializeObject(ds);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        [HttpPost]
        public JsonResult TakePaymentMisc(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                long id = 0, u_id = 0;
                if (!string.IsNullOrEmpty(model.strValue1)) id = Convert.ToInt64(model.strValue1);
                UserActivityLog.WriteDbLog(LogType.Submit, "Pay Invoice Misc Payment", "/PaymentInvoice/TakePaymentMisc/" + id + "" + ", " + Net.BrowserInfo);
                u_id = CommanUtilities.Provider.GetCurrent().UserID;
                System.Xml.XmlDocument orderXML = JsonConvert.DeserializeXmlNode("{\"Data\":" + model.strValue2 + "}", "Items");
                System.Xml.XmlDocument orderdetailsXML = JsonConvert.DeserializeXmlNode("{\"Data\":" + model.strValue3 + "}", "Items");
                JSONresult = JsonConvert.SerializeObject(PaymentInvoiceRepository.AddNewMiscPayment(id, "POP", u_id, orderXML, orderdetailsXML));
            }
            catch { }
            return Json(JSONresult, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetcheckList(JqDataTableModel model)
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

                DataTable dt = PaymentInvoiceRepository.GetcheckList(model.strValue1, fromdate, todate, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }

        [HttpPost]
        public JsonResult GetPaymentcheckdetails(JqDataTableModel model)
        {
            string result = string.Empty;
            try
            {
                long id = 0;
                if (!string.IsNullOrEmpty(model.strValue1))
                    id = Convert.ToInt64(model.strValue1);
                DataTable dt = PaymentInvoiceRepository.GetPaymentcheckdetails(id);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }

        //[HttpPost]
        //public JsonResult TakePayment(PaymentInvoiceModel model)
        //{
        //    string JSONstring = string.Empty; bool b_status = false; long ID = 0;
        //    try
        //    {
        //        ID = new PaymentInvoiceRepository().TakePayment(model);

        //        if (ID > 0)
        //        {
        //            b_status = true; JSONstring = "Payment has been taken successfully!!";
        //        }
        //        else
        //        {
        //            b_status = false; JSONstring = "Invalid Details.";
        //        }
        //    }
        //    catch (Exception Ex)
        //    {
        //        b_status = false; JSONstring = Ex.Message;
        //    }
        //    return Json(new { status = b_status, message = JSONstring, id = ID }, 0);
        //}

    }
}