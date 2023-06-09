﻿using LaylaERP.BAL;
using LaylaERP.Models;
using LaylaERP.UTILITIES;
using Microsoft.Ajax.Utilities;
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
        public ActionResult NewPurchaseOrder(long id = 0)
        {
            ViewBag.id = id;
            return View();
        }
        public ActionResult PurchaseOrderDetails()
        {
            return View();
        }
        public ActionResult PurchaseOrderList()
        {
            return View();
        }

        [HttpPost]
        public JsonResult SearchProducts(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable DT = PurchaseOrderRepository.SearchProducts(model.strValue1);
                JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        [HttpGet]
        public JsonResult GetVenderProducts(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                long id = 0;
                if (!string.IsNullOrEmpty(model.strValue1))
                    id = Convert.ToInt64(model.strValue1);
                DataTable DT = PurchaseOrderRepository.SearchVenderProducts(id);
                JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        [HttpGet]
        public JsonResult SearchProductDetails(SearchModel model)
        {
            List<PurchaseOrderProductsModel> obj = new List<PurchaseOrderProductsModel>();
            try
            {
                long pid = 0, vid = 0;
                if (!string.IsNullOrEmpty(model.strValue1))
                    pid = Convert.ToInt64(model.strValue1);
                if (!string.IsNullOrEmpty(model.strValue2))
                    vid = Convert.ToInt64(model.strValue2);
                obj = PurchaseOrderRepository.GetProductsDetails(pid, vid);
            }
            catch { }
            return Json(obj, 0);
        }
        [HttpGet]
        public JsonResult GetAllMaster(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataSet DS = PurchaseOrderRepository.GetAllMasterList();
                JSONresult = JsonConvert.SerializeObject(DS);
            }
            catch { }
            return Json(JSONresult, 0);
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
        [HttpGet]
        public JsonResult GetVendorByID(SearchModel model)
        {
            long id = 0;
            string result = string.Empty;
            try
            {
                if (!string.IsNullOrEmpty(model.strValue1))
                    id = Convert.ToInt64(model.strValue1);
                DataTable dt = PurchaseOrderRepository.GetVendorByID(id);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(result, 0);
        }
        [HttpPost]
        public JsonResult NewPurchase(PurchaseOrderModel model)
        {
            string JSONstring = string.Empty; bool b_status = false; long ID = 0;
            try
            {
                model.LoginID = CommanUtilities.Provider.GetCurrent().UserID;
                ID = new PurchaseOrderRepository().AddNewPurchase(model);

                if (ID > 0)
                {
                    b_status = true; JSONstring = "Purchase Record has been updated successfully!!";
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
        [HttpGet]
        public JsonResult UpdatePurchaseOrderStatus(PurchaseOrderModel model)
        {
            string JSONstring = string.Empty; bool b_status = false;
            try
            {
                model.LoginID = CommanUtilities.Provider.GetCurrent().UserID;
                if (new PurchaseOrderRepository().UpdatePurchaseStatus(model) > 0)
                { b_status = true; JSONstring = "Purchase Record has been updated successfully!!"; }
                else
                { b_status = false; JSONstring = "Invalid Details."; }
            }
            catch (Exception Ex)
            {
                b_status = false; JSONstring = Ex.Message;
            }
            return Json(new { status = b_status, message = JSONstring }, 0);

        }
        public JsonResult GetPurchaseOrderList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = PurchaseOrderRepository.GetPurchaseOrder(model.strValue1, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
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
                if (!string.IsNullOrEmpty(model.strValue1))
                    id = Convert.ToInt64(model.strValue1);
                DataSet ds = PurchaseOrderRepository.GetPurchaseOrderByID(id);
                JSONresult = JsonConvert.SerializeObject(ds);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        [HttpGet]
        public JsonResult GetPurchaseOrderPrint(SearchModel model)
        {
            string JSONresult = string.Empty;
            OperatorModel om = CommanUtilities.Provider.GetCurrent();
            try
            {
                long id = 0;
                if (!string.IsNullOrEmpty(model.strValue1))
                    id = Convert.ToInt64(model.strValue1);
                DataSet ds = PurchaseOrderRepository.GetPurchaseOrder(id);
                JSONresult = JsonConvert.SerializeObject(ds);
            }
            catch { }
            return Json(new { com_name = om.CompanyName, add = om.address, add1 = om.address1, city = om.City, state = om.State, zip = om.postal_code, country = om.Country, phone = om.user_mobile, email = om.email, website = om.website, data = JSONresult }, 0);
        }
        [HttpGet]
        public JsonResult GetPurchaseOrderPayments(SearchModel model)
        {
            string JSONresult = string.Empty;
            OperatorModel om = CommanUtilities.Provider.GetCurrent();
            try
            {
                long id = 0;
                if (!string.IsNullOrEmpty(model.strValue1))
                    id = Convert.ToInt64(model.strValue1);
                DataTable ds = PurchaseOrderRepository.GetPurchaseOrderPayment(id);
                JSONresult = JsonConvert.SerializeObject(ds);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        [HttpPost]
        public JsonResult SendMailInvoice(SearchModel model)
        {
            string result = string.Empty;
            bool status = false;
            try
            {
                status = true;
                string strBody = "Dear User,<br /> Atteched please find your PO number #" + model.strValue2 + ". If you have any questions please feel free to contact us.<br /><br /><br /><br />"
                    + CommanUtilities.Provider.GetCurrent().CompanyName + "<br />" + CommanUtilities.Provider.GetCurrent().address
                    + (CommanUtilities.Provider.GetCurrent().address1.Length > 0 ? "<br />" + CommanUtilities.Provider.GetCurrent().address1 + "<br />" : "")
                    + CommanUtilities.Provider.GetCurrent().City + ", " + CommanUtilities.Provider.GetCurrent().State + " " + CommanUtilities.Provider.GetCurrent().postal_code + "<br />"
                    + "Phone : " + CommanUtilities.Provider.GetCurrent().country_code_phone + " " + CommanUtilities.Provider.GetCurrent().user_mobile + "<br />"
                    + CommanUtilities.Provider.GetCurrent().EmailID + "<br />" + CommanUtilities.Provider.GetCurrent().website;

                result = SendEmail.SendEmails(model.strValue1, "Your Purchase order #" + model.strValue2 + " has been received", strBody, model.strValue3);
            }
            catch { status = false; result = ""; }
            return Json(new { status = status, message = result }, 0);
        }

    }
}