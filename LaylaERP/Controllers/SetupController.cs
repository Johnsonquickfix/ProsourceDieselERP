using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using LaylaERP.BAL;
using LaylaERP.DAL;
using LaylaERP.Models;
using Newtonsoft.Json;

namespace LaylaERP.Controllers
{
    public class SetupController : Controller
    {
        // GET: Setup
        public ActionResult productrule()
        {
            return View();
        }
        public ActionResult Editproductrule()
        {
            return View();
        }

        public JsonResult GetProduct()
        {
            DataSet ds = SetupRepostiory.GetProducts();
            List<SelectListItem> productlist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                productlist.Add(new SelectListItem { Text = dr["text"].ToString(), Value = dr["id"].ToString() });
            }
            return Json(productlist, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetVendor()
        {
            DataSet ds = SetupRepostiory.GetVendor();
            List<SelectListItem> vendorlist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                vendorlist.Add(new SelectListItem { Text = dr["name"].ToString(), Value = dr["rowid"].ToString() });
            }
            return Json(vendorlist, JsonRequestBehavior.AllowGet);
        }


        public JsonResult Getvendordetails(SearchModel model)
        {

            string JSONresult = string.Empty;
            try
            {
                DataTable dt = SetupRepostiory.Getvendordetails(model);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public JsonResult GetWarehouse(SearchModel model)
        {
            DataSet ds = SetupRepostiory.GetWarehouse(model);
            List<SelectListItem> vendorlist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                vendorlist.Add(new SelectListItem { Text = dr["wname"].ToString(), Value = dr["wid"].ToString() });
            }
            return Json(vendorlist, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetIdProductWarehouserule()
        {

            string JSONresult = string.Empty;
            try
            {
                DataTable dt = SetupRepostiory.GetIdProductWarehouserule();
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        [HttpPost]
        public JsonResult AddProductWarehouseRule(SetupModel model)
        {
           
            int ID = SetupRepostiory.AddProductWarehouseRule(model);
            if (ID > 0)
            {
                
                return Json(new { status = true, message = "Product Data has been saved successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }
        }

        public JsonResult AddProductWarehouseRuleDetails(SetupModel model)
        {
            
            int ID = SetupRepostiory.AddProductWarehouseRuleDetails(model);
            if (ID > 0)
            {
                
                return Json(new { status = true, message = "Data has been saved successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }
        }

        public JsonResult GetTableWarehouseRule()
        {

            string JSONresult = string.Empty;
            try
            {
                DataTable dt = SetupRepostiory.GetTableWarehouseRule();
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        //public JsonResult SelectTableWarehouseRule(SearchModel model)
        //{

        //    string JSONresult = string.Empty;
        //    try
        //    {
        //        DataTable dt = SetupRepostiory.SelectTableWarehouseRule(model);
        //        JSONresult = JsonConvert.SerializeObject(dt);
        //    }
        //    catch { }
        //    return Json(JSONresult, 0);
        //}

        public JsonResult SelectTableWarehouseRule(long id)
        {

            string JSONresult = string.Empty;
            try
            {
                DataTable dt = SetupRepostiory.SelectTableWarehouseRule(id);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        [HttpPost]
        public JsonResult UpdateProductWarehouseRule(SetupModel model)
        {
            
            if (model.searchid > 0)
            {
                SetupRepostiory.UpdateProductWarehouseRule(model);
                return Json(new { status = true, message = "Data has been saved successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }

        }

        public JsonResult GetProductCount(SetupModel model)
        {
            int ID = SetupRepostiory.GetProductCount(model);
            if (ID > 0)
            {

                return Json(new { status = true, message = "Product already exists", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }
        }

        public JsonResult GetPrefixCount(SetupModel model)
        {
            int ID = SetupRepostiory.GetPrefixCount(model);
            if (ID > 0)
            {

                return Json(new { status = true, message = "Product already exists", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }
        }
    }
}