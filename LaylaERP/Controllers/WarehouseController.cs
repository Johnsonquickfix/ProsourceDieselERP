using LaylaERP.BAL;
using LaylaERP.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Dynamic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LaylaERP.Controllers
{
    public class WarehouseController : Controller
    {
        // GET: Warehouse
        public ActionResult Index()
        {
            return View();
        }
        
        public ActionResult AddNewWarehouse()
        {
            WarehouseModel model = new WarehouseModel();
           
            return View(model);
        }
        public ActionResult Warehouse()
        {
            return View();
        }

        public JsonResult GetWarehouse(SearchModel model)
        {
            
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = WarehouseRepository.GetWarehouseDetail(model);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }


        [HttpPost]
        public JsonResult AddWarehouse(WarehouseModel model)
        {
            if (ModelState.IsValid)
            {
                if (model.rowid > 0)
                {
                    
                }
                else
                {
                    int ID = WarehouseRepository.AddWarehouse(model);
                    if (ID > 0)
                    {
                        return Json(new { status = true, message = "Data has been saved successfully!!", url = "" }, 0);
                    }
                    else
                    {
                        return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
                    }
                }
            }
            return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
        }

        public ActionResult UpdateWarehouse(int rowid)
        {
            
            dynamic myModel = new ExpandoObject();
            myModel.rowid = null;
            myModel.reff = null;
            myModel.description = null;
            myModel.lieu = null;
            myModel.phone = null;
            myModel.fax = null;
            //myModel.statut = null;
            myModel.address = null;
            myModel.zip = null;
            myModel.town = null;
            myModel.country = null;
            myModel.address1 = null;
            myModel.city = null;
            myModel.status = null;
            myModel.warehouse_type = null;
            DataTable dt = WarehouseRepository.GetWarehouseID(rowid);
            myModel.rowid = rowid;
            myModel.reff = dt.Rows[0]["ref"];
            myModel.description = dt.Rows[0]["description"];
            myModel.lieu = dt.Rows[0]["lieu"];
            myModel.phone = dt.Rows[0]["phone"];
            myModel.fax = dt.Rows[0]["fax"];
            //myModel.statut = dt.Rows[0]["statut"];
            myModel.address = dt.Rows[0]["address"];
            myModel.zip = dt.Rows[0]["zip"];
            myModel.town = dt.Rows[0]["town"];
            myModel.country = dt.Rows[0]["country"];
            myModel.address1 = dt.Rows[0]["address1"];
            myModel.city = dt.Rows[0]["city"];
            myModel.status = dt.Rows[0]["status"];
            myModel.warehouse_type = dt.Rows[0]["warehouse_type"];
            return PartialView("UpdateWarehouse", myModel);
        }

        [HttpPost]
        public JsonResult Updatewarehouses(WarehouseModel model)
        {
            //int menu_id = 0;
            //AppearanceRepository.UpdateUsers(model);
            if (model.rowid > 0)
            {
                WarehouseRepository.Updatewarehouses(model);
                ModelState.Clear();
                return Json(new { status = true, message = "Data has been saved successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }

        }

        public ActionResult MasStockTransfer()
        {
            
            return View();
        }

        public JsonResult Gettargetwarehouse()
        {
            DataTable dt = new DataTable();
            dt = WarehouseRepository.GetSourceWarehouse();
            List<SelectListItem> warehouselist = new List<SelectListItem>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                warehouselist.Add(new SelectListItem
                {
                    Value = dt.Rows[i]["rowid"].ToString(),
                    Text = dt.Rows[i]["ref"].ToString()

                });
            }
            return Json(warehouselist, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetProduct()
        {
            DataTable dt = new DataTable();
            dt = WarehouseRepository.GetProduct();
            List<SelectListItem> warehouselist = new List<SelectListItem>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                warehouselist.Add(new SelectListItem
                {
                    Value = dt.Rows[i]["pr_id"].ToString(),
                    Text = dt.Rows[i]["post_title"].ToString()

                });
            }
            return Json(warehouselist, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult AddMouvment(WarehouseModel model)
        {
                    int ID = WarehouseRepository.AddMouvement(model);
                    if (ID > 0)
                    {
                        return Json(new { status = true, message = "Data has been saved successfully!!", url = "" }, 0);
                    }
                    else
                    {
                        return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
                    }
                
        }
        [HttpPost]
        public JsonResult GetProductInfo(WarehouseModel model,int id)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = WarehouseRepository.GetProductDetails(id);
                //model.price = Convert.ToInt32(dt.Rows[0]["sale_price"].ToString());
                //ViewBag.price = model.price;
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public ActionResult StockMouvementList()
        {
            return View();
        }

        public JsonResult GetStockMouvement()
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = WarehouseRepository.GetStockMouvment();
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public ActionResult GetStockAtDate()
        {
            return View();
        }

        public JsonResult ListStockAtDate(WarehouseModel model)
        {
            //int id = model.fk_product;
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = WarehouseRepository.GetStockAtDate(model);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public ActionResult ListWarehouseByVendor()
        {
            return View();
        }
        public JsonResult GetWarehouseByVendor( WarehouseModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                string urid = "";
                if (model.user_status != "")
                    urid = model.user_status;
                string searchid = model.Search;
                DataTable dt = WarehouseRepository.GetWarehouseByVendor(urid, searchid, model.PageNo, model.PageSize, out TotalRecord, model.SortCol, model.SortDir);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }


        public JsonResult Getvendorwarehouse(SearchModel model)
        {

            string JSONresult = string.Empty;
            try
            {
                DataTable dt = WarehouseRepository.Getvendorwarehouse(model);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public JsonResult GetWarehousename(SearchModel model)
        {
            DataSet ds = WarehouseRepository.GetWarehouse();
            List<SelectListItem> warehouselist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {

                warehouselist.Add(new SelectListItem { Text = dr["ref"].ToString(), Value = dr["rowid"].ToString() });

            }
            return Json(warehouselist, JsonRequestBehavior.AllowGet);
        }
    }
}