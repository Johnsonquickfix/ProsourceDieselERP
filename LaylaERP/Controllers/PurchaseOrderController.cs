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
    public class PurchaseOrderController : Controller
    {
        // GET: PurchaseOrder
        public ActionResult NewPurchaseOrder()
        {
            return View();
        }
        public JsonResult GetIncoterm(SearchModel model)
        {
            DataSet ds = BAL.PurchaseOrderRepository.GetIncoterm();
            List<SelectListItem> productlist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                productlist.Add(new SelectListItem { Text = dr["IncoTerm"].ToString(), Value = dr["ID"].ToString() });
            }
            return Json(productlist, JsonRequestBehavior.AllowGet);

        }
        public JsonResult GetVendor(SearchModel model)
        {
            DataSet ds = BAL.PurchaseOrderRepository.GetVendor();
            List<SelectListItem> productlist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                productlist.Add(new SelectListItem { Text = dr["Name"].ToString(), Value = dr["ID"].ToString() });
            }
            return Json(productlist, JsonRequestBehavior.AllowGet);

        }
        public JsonResult GetIncotermByID(PurchaseOrderModel model)
        {
            int id = model.IncotermsTypeID;
            string result = string.Empty;
            try
            {
                DataTable dt = PurchaseOrderRepository.GetIncotermByID(id);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(result, 0);
        }
        public JsonResult GetVendorByID(PurchaseOrderModel model)
        {
            int id = model.VendorID;
            string result = string.Empty;
            try
            {
                DataTable dt = PurchaseOrderRepository.GetVendorByID(id);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(result, 0);
        }
        public JsonResult GetPaymentTerm(SearchModel model)
        {
            DataSet ds = BAL.PurchaseOrderRepository.GetPaymentTerm();
            List<SelectListItem> productlist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {

                productlist.Add(new SelectListItem { Text = dr["PaymentTerm"].ToString(), Value = dr["ID"].ToString() });

            }
            return Json(productlist, JsonRequestBehavior.AllowGet);

        }
        public JsonResult GetPaymentType(SearchModel model)
        {
            DataSet ds = BAL.PurchaseOrderRepository.GetPaymentType();
            List<SelectListItem> productlist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {

                productlist.Add(new SelectListItem { Text = dr["PaymentType"].ToString(), Value = dr["ID"].ToString() });

            }
            return Json(productlist, JsonRequestBehavior.AllowGet);

        }
        public JsonResult NewPurchaseOrderEdit(PurchaseOrderModel model)
        {
            if (ModelState.IsValid)
            {
                if (model.rowid > 0)
                {
                    new PurchaseOrderRepository().EditPurchase(model, model.rowid);
                    return Json(new { status = true, message = "Purchase Record has been updated successfully!!", url = "", id = model.rowid }, 0);
                }
                else
                {
                    int ID = new PurchaseOrderRepository().AddNewPurchase(model);
                    if (ID > 0)
                    {
                        ModelState.Clear();
                        return Json(new { status = true, message = "Purchase Record has been saved successfully!!", url = "", id = ID }, 0);
                    }
                    else
                    {
                        return Json(new { status = false, message = "Invalid Details", url = "", id = 0 }, 0);
                    }
                }
            }
            return Json(new { status = false, message = "Invalid Details", url = "", id = 0 }, 0);
        }
    }
}