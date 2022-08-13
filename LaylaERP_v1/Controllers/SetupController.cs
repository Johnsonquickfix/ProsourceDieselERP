using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using LaylaERP.BAL;
using LaylaERP.DAL;
using LaylaERP.Models;
using LaylaERP.UTILITIES;
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

        public ActionResult freeproduct()
        {
            return View();
        }
        public ActionResult editfreeproduct()
        {
            return View();
        }
        public ActionResult ProductReturnDays()
        {
            return View();
        }
        public ActionResult ProductType()
        {
            return View();
        }
        public ActionResult MerchantFee()
        {
            return View();
        }
        public ActionResult accountingclasstransaction()
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
                UserActivityLog.WriteDbLog(LogType.Submit, "Add Sufix logic", "/Setup/productrule" + ", " + Net.BrowserInfo);
                return Json(new { status = true, message = "Data saved successfully!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }
        }

        public JsonResult AddProductWarehouseRuleDetails(SetupModel model)
        {
            UserActivityLog.WriteDbLog(LogType.Submit, "Add Sufix logic", "/Setup/productrule" + ", " + Net.BrowserInfo);
            DataTable dt1 = SetupRepostiory.CountRuleForState(model);
            if (dt1.Rows.Count > 0)
            {
                return Json(new { status = false, message = "Product rule already exists for these states", url = "" }, 0);
            }
            else
            {
                int ID = SetupRepostiory.AddProductWarehouseRuleDetails(model);
                if (ID > 0)
                {

                    return Json(new { status = true, message = "Product rule saved successfully!!", url = "" }, 0);
                }
                else
                {
                    return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
                }
            }
        }

        public JsonResult GetTableWarehouseRule(SetupModel model)
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
                UserActivityLog.WriteDbLog(LogType.Submit, "Update product warehouse rule", "Editproductrule/" + ", " + Net.BrowserInfo);

                DataTable dt1 = SetupRepostiory.CountRuleForUpdateState(model);
                if (dt1.Rows.Count > 0)
                {
                    return Json(new { status = false, message = "Product rule already exists for some states", url = "" }, 0);
                }
                else
                {
                    SetupRepostiory.UpdateProductWarehouseRule(model);
                    return Json(new { status = true, message = "Product rule updated successfully!", url = "" }, 0);
                }
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

        public JsonResult GetFreeProductCount(SetupModel model)
        {
            int ID = SetupRepostiory.GetFreeProductCount(model);
            if (ID > 0)
            {

                return Json(new { status = true, message = "Product already exists", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }
        }

        public JsonResult AddFreeProduct(SetupModel model)
        {
            int ID = SetupRepostiory.AddFreeProduct(model);
            if (ID > 0)
            {

                return Json(new { status = true, message = "Free product saved successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }
        }

        public JsonResult GetFreeProduct()
        {

            string JSONresult = string.Empty;
            try
            {
                DataTable dt = SetupRepostiory.GetFreeProduct();
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public JsonResult SelectFreeProduct(long id)
        {

            string JSONresult = string.Empty;
            try
            {
                DataTable dt = SetupRepostiory.SelectFreeProduct(id);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public JsonResult GetProducts2()
        {
            DataSet ds = SetupRepostiory.GetProducts2();
            List<SelectListItem> productlist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                productlist.Add(new SelectListItem { Text = dr["text"].ToString(), Value = dr["id"].ToString() });
            }
            return Json(productlist, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult UpdateFreeProduct(SetupModel model)
        {

            if (model.rowid > 0)
            {
                SetupRepostiory.UpdateFreeProduct(model);
                return Json(new { status = true, message = "Free product updated successfully!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }

        }
        public JsonResult SelectProductToReUse(long id)
        {

            string JSONresult = string.Empty;
            try
            {
                DataTable dt = SetupRepostiory.SelectProductToReUse(id);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(JSONresult, 0);
        }

        public JsonResult GetState(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable DT = SetupRepostiory.GetState(model.strValue1, model.strValue2);
                JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public JsonResult AddProductReturn(ProductReturnModel model)
        {
            DataTable dt = SetupRepostiory.SelectProductId(model.productid);
            if (dt.Rows.Count > 0)
            {
                return Json(new { status = false, message = "Product already exists.", url = "" }, 0);
            }
            else
            {
                int ID = SetupRepostiory.AddProductReturn(model);
                if (ID > 0)
                {

                    return Json(new { status = true, message = "Product return rules saved successfully!", url = "" }, 0);
                }
                else
                {
                    return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
                }
            }
        }
        public JsonResult UpdateProductReturn(ProductReturnModel model)
        {
            if (model.rowid > 0)
            {
                SetupRepostiory.UpdateProductReturn(model);
                return Json(new { status = true, message = "Product return rules updated successfully!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }
        }
        public JsonResult GetTransactionTypeList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = SetupRepostiory.GetTransactionTypeList(model.strValue1, model.strValue2, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }

        public JsonResult GetProductReturnById(string strValue1)
        {
            string JSONResult = string.Empty;
            DataTable dt = new DataTable();
            try
            {
                dt = SetupRepostiory.GetProductReturnById(strValue1);
                JSONResult = JsonConvert.SerializeObject(dt);
            }
            catch(Exception ex)
            {
                throw ex;
            }
            return Json(JSONResult,0);
        }

        public JsonResult GetProductTypeList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = SetupRepostiory.GetProductTypeList(model.strValue1, model.strValue2, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }


        public JsonResult GetProductTypeById(string strValue1)
        {
            string JSONResult = string.Empty;
            DataTable dt = new DataTable();
            try
            {
                dt = SetupRepostiory.GetProductTypeById(strValue1);
                JSONResult = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Json(JSONResult, 0);
        }
        public JsonResult UpdateProducttype(ProductTypeModel model)
        {
            SetupRepostiory.UpdateProductType(model);
            if (model.rowid > 0)
            { 
                return Json(new { status = true, message = "Product type updated successfully!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = true, message = "Product type save successfully!", url = "" }, 0);
            }
        }

        public JsonResult Getaccountingclasstransactionlist(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = SetupRepostiory.Getaccountingclasstransactionlist(model.strValue1, model.strValue2, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }
        public JsonResult GetclasstransactionById(string strValue1)
        {
            string JSONResult = string.Empty;
            DataTable dt = new DataTable();
            try
            {
                dt = SetupRepostiory.GetclasstransactionById(strValue1);
                JSONResult = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Json(JSONResult, 0);
        }

        public JsonResult Addtclassransacion(AccountingClassTransaction model)
        {
            SetupRepostiory.Addtclassransacion(model);
            if (model.rowid > 0)
            {
                return Json(new { status = true, message = "Accounting class transacion updated successfully!", url = "update" }, 0);
            }
            else
            {
                return Json(new { status = true, message = "Accounting class transacion save successfully!", url = "save" }, 0);
            }
        }

        public JsonResult GetMerchantFeeList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = SetupRepostiory.GetMerchantFeeList(model.strValue1, model.strValue2, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }
        public JsonResult GetMerchantFeeById(string strValue1)
        {
            string JSONResult = string.Empty;
            DataTable dt = new DataTable();
            try
            {
                dt = SetupRepostiory.GetMerchantFeeById(strValue1);
                JSONResult = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Json(JSONResult, 0);
        }

        public JsonResult AddMerchantFee(MerchantfeeModel model)
        {
            SetupRepostiory.AddMerchantFee(model);
            if (model.rowid > 0)
            {
                return Json(new { status = true, message = "Merchant fee updated successfully!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = true, message = "Merchant fee save successfully!", url = "" }, 0);
            }
        }

    }
}