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
        public JsonResult GetProductList()
        {
            DataSet ds = InventoryRepository.GetProducts(); ;
            List<SelectListItem> productlist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {

                productlist.Add(new SelectListItem { Text = dr["post_title"].ToString(), Value = dr["id"].ToString() });

            }
            return Json(productlist, JsonRequestBehavior.AllowGet);
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
    }
}