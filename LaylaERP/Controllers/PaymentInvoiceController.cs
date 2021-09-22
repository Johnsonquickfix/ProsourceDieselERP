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
                long id = 0;
                //if (!string.IsNullOrEmpty(model.strValue1))
                //    id = Convert.ToInt64(model.strValue1);
                DataSet ds = PaymentInvoiceRepository.GetPurchaseOrderByID(id);
                JSONresult = JsonConvert.SerializeObject(ds);
            }
            catch { }
            return Json(JSONresult, 0);
        }
    }
}