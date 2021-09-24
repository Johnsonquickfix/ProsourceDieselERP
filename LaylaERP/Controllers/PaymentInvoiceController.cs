using LaylaERP.BAL;
using LaylaERP.Models;
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
        public JsonResult GetPurchaseOrderList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = PaymentInvoiceRepository.GetPurchaseOrder(model.strValue1, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }
        public JsonResult GetPartiallyOrderList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = PaymentInvoiceRepository.GetPartiallyOrderList(model.strValue1, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }
        [HttpGet]
        public JsonResult GetPurchaseOrderByID(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                //long id = 0;
                DataSet ds = new DataSet();
                if (model.strValue1 == "PO")
                     ds = PaymentInvoiceRepository.GetPRPurchaseOrderByID(model.strValue2);
                else
                     ds = PaymentInvoiceRepository.GetPurchaseOrderByID(model.strValue2);

                //if (!string.IsNullOrEmpty(model.strValue1))
                //    id = Convert.ToInt64(model.strValue1);
                //DataSet ds = PaymentInvoiceRepository.GetPurchaseOrderByID(id);
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

        [HttpPost]
        public JsonResult TakePayment(PaymentInvoiceModel model)
        {
            string JSONstring = string.Empty; bool b_status = false; long ID = 0;
            try
            {
                ID = new PaymentInvoiceRepository().TakePayment(model);

                if (ID > 0)
                {
                    b_status = true; JSONstring = "Payment has been taken successfully!!";
                }
                else
                {
                    b_status = false; JSONstring = "Invalid Details.";
                }
            }
            catch (Exception Ex)
            {
                b_status = false; JSONstring = Ex.Message;
            }
            return Json(new { status = b_status, message = JSONstring, id = ID }, 0);
        }

    }
}