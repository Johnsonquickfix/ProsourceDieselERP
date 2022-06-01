using LaylaERP.BAL;
using LaylaERP.Models;
using LaylaERP.UTILITIES;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
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
        public JsonResult getpaymenttypebill()
        {
            string JSONString = string.Empty;
            DataTable dt = new DataTable();
            dt = BAL.PaymentInvoiceRepository.getpaymenttypebill();
            JSONString = JsonConvert.SerializeObject(dt);
            return Json(JSONString, JsonRequestBehavior.AllowGet);
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
                
                 String ApiLoginID = CommanUtilities.Provider.GetCurrent().AuthorizeAPILogin, ApiTransactionKey = CommanUtilities.Provider.GetCurrent().AuthorizeTransKey;

                var result = string.Empty;
                ////long i = 1;

                ////foreach (byte b in Guid.NewGuid().ToByteArray())
                ////{
                ////    i *= ((int)b + 1);
                ////}
                if (model.SortDir == "1" || model.SortDir == "4" || model.SortDir == "7" || model.SortDir == "8" || model.SortDir == "2" || model.SortDir == "3")
                {
                    string number = "0"; // String.Format("{0:d9}", (DateTime.Now.Ticks / 10) % 1000000000);

                    if (model.SortDir == "7" || model.SortDir == "8")
                    {
                        result = clsAuthorizeNet.CreditCardPayment(ApiLoginID, ApiTransactionKey, model.strValue5, model.strValue4, Convert.ToDecimal(model.strValue6),model.SortCol,model.PageNo,model.PageSize);
                    }
                    if (model.SortDir == "1" || model.SortDir == "4")
                    {
                        result = clsAuthorizeNet.Fundtransfer(ApiLoginID, ApiTransactionKey, number, model.strValue5, model.strValue4, Convert.ToDecimal(model.strValue6));
                    }

                    //if (!string.IsNullOrEmpty(result))
                    //{
                        long id = 0, u_id = 0;
                        if (!string.IsNullOrEmpty(model.strValue1)) id = Convert.ToInt64(model.strValue1);
                        UserActivityLog.WriteDbLog(LogType.Submit, "Pay Invoice Misc Payment", "/PaymentInvoice/TakePaymentMisc/" + id + "" + ", " + Net.BrowserInfo);
                        u_id = CommanUtilities.Provider.GetCurrent().UserID;
                        System.Xml.XmlDocument orderXML = JsonConvert.DeserializeXmlNode("{\"Data\":" + model.strValue2 + "}", "Items");
                        System.Xml.XmlDocument orderdetailsXML = JsonConvert.DeserializeXmlNode("{\"Data\":" + model.strValue3 + "}", "Items");
                        JSONresult = JsonConvert.SerializeObject(PaymentInvoiceRepository.AddNewMiscPayment(result, id, "POP", u_id, orderXML, orderdetailsXML));
                    //}
                                     
                }
                else
                {
                    return Json(JSONresult, 0);
                }
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

                DataTable dt = PaymentInvoiceRepository.GetcheckList(model.strValue1, Convert.ToInt32(model.strValue4), Convert.ToInt32(model.strValue5), fromdate, todate, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
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

        public JsonResult getbankaccount(SearchModel model)
        {
            DataSet ds = BAL.PaymentInvoiceRepository.getbankaccount();
            List<SelectListItem> productlist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                productlist.Add(new SelectListItem { Text = dr["Name"].ToString(), Value = dr["ID"].ToString() });
            }
            return Json(productlist, JsonRequestBehavior.AllowGet);

        }

        [HttpGet]
        public JsonResult getpaidmishistory(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                long id = 0;
                if (!string.IsNullOrEmpty(model.strValue1))
                    id = Convert.ToInt64(model.strValue1);
                DataSet ds = PaymentInvoiceRepository.getpaidmishistory(id);
                JSONresult = JsonConvert.SerializeObject(ds);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public JsonResult getpaymentterm(SearchModel model)
        {
            DataSet ds = BAL.PaymentInvoiceRepository.getpaymentterm();
            List<SelectListItem> productlist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                productlist.Add(new SelectListItem { Text = dr["Name"].ToString(), Value = dr["ID"].ToString() });
            }
            return Json(productlist, JsonRequestBehavior.AllowGet);

        }

        [HttpGet]
        public JsonResult GetVendorByID(SearchModel model)
        {
            long id = 0;
            string result = string.Empty;
            try
            {
                if (!string.IsNullOrEmpty(model.strValue1))
                    id = Convert.ToInt64(model.strValue1);
                DataTable dt = PaymentInvoiceRepository.GetVendorByID(id);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
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

        [HttpPost]
        public ActionResult FileUploade(string Name, HttpPostedFileBase ImageFile)
        {
            try
            {

                if (ImageFile != null)
                {

                    ProductModel model = new ProductModel();
                    //Use Namespace called :  System.IO  
                    string FileName = Path.GetFileNameWithoutExtension(ImageFile.FileName);
                    FileName = System.Text.RegularExpressions.Regex.Replace(FileName, @"\s+", "");
                    //To Get File Extension  
                    long filesize = ImageFile.ContentLength / 1024;
                    string FileExtension = Path.GetExtension(ImageFile.FileName);

                    if (FileExtension == ".xlsx" || FileExtension == ".xls" || FileExtension == ".XLS" || FileExtension == ".pdf" || FileExtension == ".PDF" || FileExtension == ".doc" || FileExtension == ".docx" || FileExtension == ".png" || FileExtension == ".PNG" || FileExtension == ".jpg" || FileExtension == ".JPG" || FileExtension == ".jpeg" || FileExtension == ".JPEG" || FileExtension == ".bmp" || FileExtension == ".BMP")
                    {
                        //Add Current Date To Attached File Name  
                        //FileName = DateTime.Now.ToString("yyyyMMdd") + "-" + FileName.Trim() + FileExtension;

                        FileName = FileName.Trim() + FileExtension;
                        string FileNameForsave = FileName;


                        DataTable dt = ReceptionRepository.GetfileCountdata(Convert.ToInt32(Name), FileName);
                        if (dt.Rows.Count > 0)
                        {
                            return Json(new { status = false, message = "File already uploaded", url = "" }, 0);
                        }
                        else
                        {

                            string UploadPath = Path.Combine(Server.MapPath("~/Content/MiscBillsFiles"));
                            UploadPath = UploadPath + "\\";
                            //Its Create complete path to store in server.  
                            model.ImagePath = UploadPath + FileName;
                            //To copy and save file into server.  
                            ImageFile.SaveAs(model.ImagePath);
                            var ImagePath = "~/Content/MiscBillsFiles/" + FileName;
                            int resultOne = PaymentInvoiceRepository.FileUploade(Convert.ToInt32(Name), FileName, filesize.ToString(), FileExtension, ImagePath);

                            if (resultOne > 0)
                            {
                                return Json(new { status = true, message = "File upload successfully!!", url = "Manage" }, 0);
                            }
                            else
                            {
                                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
                            }
                        }
                    }

                    else
                    {
                        return Json(new { status = false, message = "File Type " + FileExtension + " Not allowed", url = "" }, 0);
                    }
                }
                else
                {
                    return Json(new { status = false, message = "Please attach a document", url = "" }, 0);
                }
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = "Invalid details", url = "" }, 0);
            }

        }

        public JsonResult Deletefileuploade(ProductModel model)
        {
            JsonResult result = new JsonResult();
            //DateTime dateinc = DateTime.Now;
            //DateTime dateinc = UTILITIES.CommonDate.CurrentDate();
            var resultOne = 0;
            // model.ID = model.strVal;
            if (model.ID > 0)
                resultOne = PaymentInvoiceRepository.Deletefileuploade(model);
            if (resultOne > 0)
            {
                return Json(new { status = true, message = "deleted successfully!!", url = "Manage" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid details", url = "" }, 0);
            }
        }

        public JsonResult GetfileuploadData(SearchModel model)
        {
            List<ProductModelservices> obj = new List<ProductModelservices>();
            try
            {
                obj = PaymentInvoiceRepository.GetfileuploadData(model.strValue1, model.strValue2);
            }
            catch { }
            return Json(obj, 0);
        }

        [HttpPost]
        public JsonResult SendMailBillApproval(SearchModel model)
        {
            string result = string.Empty;
            bool status = false;
            try
            {
                status = true;
                //string strBody = "Hello sir,<br /> Purchase order number <b>#" + model.strValue2 + "</b> is waiting for your approval.<br />Please see below attached file.<br /><br /><br /><br />"
                string strBody = "Hi,<br /> Bill number <b>#" + model.strValue2 + "</b> is waiting for your approval.<br />Please see below attached file.<br /><br /><br /><br />" + model.strValue5;
                dynamic obj = JsonConvert.DeserializeObject<dynamic>(model.strValue1);
                foreach (var o in obj)
                {
                    string _mail = o.user_email, _uid = o.user_id;
                    if (!string.IsNullOrEmpty(o.user_email.Value))
                    {
                        _uid = "&uid=" + UTILITIES.CryptorEngine.Encrypt(_uid);
                        string _html = model.strValue3.Replace("{_para}", _uid);

                        result = SendEmail.SendEmails_outer(o.user_email.Value, "Approval for MISC Bill #" + model.strValue2 + ".", strBody, _html);
                    }
                }
            }
            catch { status = false; result = ""; }
            return Json(new { status = status, message = result }, 0);
        }

        [Route("paymentinvoice/bill-accept")]
        public ActionResult MiscBillApproval(string id, string uid, string key)
        {
            if (!string.IsNullOrEmpty(id))
            {
                PurchaseOrderModel obj = new PurchaseOrderModel();
                if (!string.IsNullOrEmpty(uid))
                {
                    obj.LoginID = Convert.ToInt64(UTILITIES.CryptorEngine.Decrypt(uid.Replace(" ", "+")));
                }
                if (!string.IsNullOrEmpty(uid))
                    obj.RowID = Convert.ToInt64(UTILITIES.CryptorEngine.Decrypt(id.Replace(" ", "+")));
                else
                    obj.RowID = 0;
                obj.Status = 3;
                obj.Search = key;
                if (obj.LoginID > 0 && obj.RowID > 0)
                {
                    DataTable dt = PaymentInvoiceRepository.BillApproval(obj);
                    if (dt.Rows.Count > 0)
                    {
                        ViewBag.status = dt.Rows[0]["Response"].ToString();
                        ViewBag.id = obj.RowID;
                    }
                    else
                    {
                        ViewBag.status = "You don't have permission to access please contact administrator.";
                        ViewBag.id = "0";
                    }
                }
                else
                {
                    ViewBag.status = "You don't have permission to access please contact administrator.";
                    ViewBag.id = "0";
                }
            }
            return View();
        }
        [Route("paymentinvoice/bill-reject")]
        public ActionResult MiscBillDisapprove(string id, string uid, string key)
        {
            if (!string.IsNullOrEmpty(id))
            {
                PurchaseOrderModel obj = new PurchaseOrderModel();
                if (!string.IsNullOrEmpty(uid))
                {
                    obj.LoginID = Convert.ToInt64(UTILITIES.CryptorEngine.Decrypt(uid.Replace(" ", "+")));
                }
                if (!string.IsNullOrEmpty(uid))
                    obj.RowID = Convert.ToInt64(UTILITIES.CryptorEngine.Decrypt(id.Replace(" ", "+")));
                else
                    obj.RowID = 0;
                obj.Status = 8;
                obj.Search = key;
                if (obj.LoginID > 0 && obj.RowID > 0)
                {
                    //ViewBag.status = "Success";
                    //ViewBag.id = obj.RowID;
                    DataTable dt = PaymentInvoiceRepository.BillApproval(obj);
                    if (dt.Rows.Count > 0)
                    {
                        ViewBag.status = dt.Rows[0]["Response"].ToString();
                        ViewBag.id = obj.RowID;
                    }
                    else
                    {
                        ViewBag.status = "You don't have permission to access please contact administrator.";
                        ViewBag.id = "0";
                    }
                }
                else
                {
                    ViewBag.status = "You don't have permission to access please contact administrator.";
                    ViewBag.id = "0";
                }
            }
            return View();
        }
    }
}