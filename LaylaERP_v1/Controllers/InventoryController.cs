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
    public class InventoryController : Controller
    {
        // GET: Inventory
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult ConsignmentInventory()
        {
            return View();
        }
        public JsonResult GetVarientList(InventoryModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                string urid = "";
                if (model.user_status != "")
                    urid = model.user_status;
                string searchid = model.Search;
                DataTable dt = InventoryRepository.GetVarients(model.strValue1, urid, searchid, model.PageNo, model.PageSize, out TotalRecord, model.SortCol, model.SortDir);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }
        public JsonResult GetConsignmentInventory(InventoryModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                string urid = "";
                if (model.user_status != "")
                    urid = model.user_status;
                string searchid = model.Search;
                DataTable dt = InventoryRepository.GetConsignmentInventory(model.strValue1, urid, searchid, model.PageNo, model.PageSize, out TotalRecord, model.SortCol, model.SortDir);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }
        [HttpGet]
        public JsonResult GetProductList()
        {
            string result = string.Empty;
            try
            {
                DataSet DS = InventoryRepository.GetProducts();
                result = JsonConvert.SerializeObject(DS, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }
        public JsonResult UpdateInventoryStock(InventoryModel model)
        {
            if (ModelState.IsValid)
            {
                string meta_id = model.meta_id;
                string meta_value = model.meta_value;
                    
                if (meta_id != "")
                {
                    new InventoryRepository().EditInventoryStock(meta_id,meta_value);
                    return Json(new { status = true, message = "Inventory Stock has been updated successfully!!", url = "" }, 0);
                }
                else
                {
                    return Json(new { status = false, message = "Something went wrong", url = "" }, 0);
                }
            }
            return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
        }
        [HttpGet]
        public JsonResult GetProductStock(JqDataTableModel model)
        {
            string result = string.Empty;
            try
            {
                DateTime fromdate = DateTime.Now, todate = DateTime.Now;
                if (!string.IsNullOrEmpty(model.strValue4))
                    fromdate = Convert.ToDateTime(model.strValue4);
                if (!string.IsNullOrEmpty(model.strValue5))
                    todate = Convert.ToDateTime(model.strValue5);
                DataTable dt = InventoryRepository.GetProductStock(model.strValue1, model.strValue2, model.strValue3, fromdate, todate);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }
        [HttpPost]
        public JsonResult GetStockByWarehouse(SearchModel model)
        {
            string result = string.Empty;
            try
            {
                DateTime fromdate = DateTime.Now, todate = DateTime.Now;
                if (!string.IsNullOrEmpty(model.strValue2))
                    fromdate = Convert.ToDateTime(model.strValue2);
                if (!string.IsNullOrEmpty(model.strValue3))
                    todate = Convert.ToDateTime(model.strValue3);
                DataTable dt = InventoryRepository.GetWarehouseStock(model.strValue1, fromdate, todate);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }
        [HttpGet]
        public JsonResult GetPOByWarehouse(SearchModel model)
        {
            string result = string.Empty;
            try
            {
                DateTime fromdate = DateTime.Now, todate = DateTime.Now;
                if (!string.IsNullOrEmpty(model.strValue3))
                    fromdate = Convert.ToDateTime(model.strValue3);
                if (!string.IsNullOrEmpty(model.strValue4))
                    todate = Convert.ToDateTime(model.strValue4);
                DataTable dt = InventoryRepository.GetPurchaseOrderByWarehouse(model.strValue1, model.strValue2, fromdate, todate);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }
        [HttpGet]
        public JsonResult ExportProductStock(JqDataTableModel model)
        {
            string result = string.Empty;
            try
            {
                DateTime fromdate = DateTime.Now, todate = DateTime.Now;
                if (!string.IsNullOrEmpty(model.strValue4))
                    fromdate = Convert.ToDateTime(model.strValue4);
                if (!string.IsNullOrEmpty(model.strValue5))
                    todate = Convert.ToDateTime(model.strValue5);
                DataSet ds = InventoryRepository.exportProductStock(model.strValue1, model.strValue2, model.strValue3, fromdate, todate);
                result = JsonConvert.SerializeObject(ds, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }
    }
}