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
        public JsonResult GetVendorByID(PurchaseOrderModel model)
        {
            long id = model.VendorID;
            string result = string.Empty;
            try
            {
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
        public JsonResult GetPurchaseOrderList(PurchaseOrderModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                string urid = "";
                if (model.user_status != "")
                    urid = model.user_status;
                string searchid = model.Search;
                DataTable dt = PurchaseOrderRepository.GetPurchaseOrder(urid, searchid, model.PageNo, model.PageSize, out TotalRecord, model.SortCol, model.SortDir);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }
        public JsonResult GetPurchaseOrderByID(string id)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = PurchaseOrderRepository.GetPurchaseOrderByID(id);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        [HttpPost]
        public JsonResult GetProductInfo(SearchModel model)
        {
            List<OrderProductsModel> obj = new List<OrderProductsModel>();
            try
            {
                long pid = 0, vid = 0;
                if (!string.IsNullOrEmpty(model.strValue1))
                    pid = Convert.ToInt64(model.strValue1);
                if (!string.IsNullOrEmpty(model.strValue2))
                    vid = Convert.ToInt64(model.strValue2);
                obj = PurchaseOrderRepository.GetProductListDetails(pid, vid);
            }
            catch { }
            return Json(obj, 0);
        }
    }
}