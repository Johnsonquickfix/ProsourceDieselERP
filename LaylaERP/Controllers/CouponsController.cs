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
    public class CouponsController : Controller
    {
        // GET: Coupons
        CouponsRepository Repo = null;
        public ActionResult Index(long id = 0)
        {
            ViewBag.id = id;
            return View("Coupons");
        }
        public ActionResult ManageCoupons()
        {
            return View();
        }
        

        [HttpPost]
        public JsonResult GetProductcategoriesList(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable DT = CouponsRepository.GetProductcategoriesList(model.strValue1);
                JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        [HttpPost]
        public JsonResult CreateCoupons(CouponsModel model)
        {
            if (model.ID > 0)
            {
               
               // Repo.EditCoupons(model, model.ID);
               // Update_MetaData(model, model.ID);        
                return Json(new { status = true, message = "Coupons Record has been updated successfully!!", url = "" }, 0);
            }
            else
            {
                int ID = CouponsRepository.AddCoupons(model);
                if (ID > 0)
                {
                    Adduser_MetaData(model, ID);
                    ModelState.Clear();
                    return Json(new { status = true, message = "Coupons has been saved successfully!!", url = "" }, 0);
                }
                else
                {
                    return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
                }
            }
        }

        private void Adduser_MetaData(CouponsModel model, long id)
        {
            string[] varQueryArr1 = new string[21];
            string[] varFieldsName = new string[21] { "discount_type", "coupon_amount", "free_shipping", "date_expires", "minimum_amount", "maximum_amount", "individual_use", "exclude_sale_items", "_wjecf_is_auto_coupon", "product_ids", "exclude_product_ids", "product_categories", "exclude_product_categories", "usage_limit", "limit_usage_to_x_items", "usage_limit_per_user", "usage_count", "shareasale_wc_tracker_coupon_upload_enabled", "_wjecf_products_and", "_wjecf_categories_and", "customer_email" };
            string[] varFieldsValue = new string[21] { model.discount_type, model.coupon_amount, model.free_shipping, model.date_expires.ToString(), model.min_subtotal, model.max_subtotal, model.individual_use, model.exclude_sale_items, model.wjecf_is_auto_coupon, model.product_ids, model.exclude_product_ids, model.categories_ids, model.exclude_categories_ids, model.usage_limit, model.limit_usage_to_x_items, model.usage_limit_per_user,"0","no","no","no",model.cus_email };
            for (int n = 0; n < 21; n++)
            {
                CouponsRepository.AddCouponMeta(model, id, varFieldsName[n], varFieldsValue[n]);
            }
        }

        private void Update_MetaData(CouponsModel model, long id)
        {
            string[] varQueryArr1 = new string[21];
            string[] varFieldsName = new string[21] { "discount_type", "coupon_amount", "free_shipping", "date_expires", "minimum_amount", "maximum_amount", "individual_use", "exclude_sale_items", "_wjecf_is_auto_coupon", "product_ids", "exclude_product_ids", "product_categories", "exclude_product_categories", "usage_limit", "limit_usage_to_x_items", "usage_limit_per_user", "usage_count", "shareasale_wc_tracker_coupon_upload_enabled", "_wjecf_products_and", "_wjecf_categories_and", "customer_email" };
            string[] varFieldsValue = new string[21] { model.discount_type, model.coupon_amount, model.free_shipping, model.date_expires.ToString(), model.min_subtotal, model.max_subtotal, model.individual_use, model.exclude_sale_items, model.wjecf_is_auto_coupon, model.product_ids, model.exclude_product_ids, model.categories_ids, model.exclude_categories_ids, model.usage_limit, model.limit_usage_to_x_items, model.usage_limit_per_user, "0", "no", "no", "no", model.cus_email };
            for (int n = 0; n < 21; n++)
            {
                Repo.UpdateMetaData(model, id, varFieldsName[n], varFieldsValue[n]);
            }
        }
        [HttpPost]
        public JsonResult GetCount(SearchModel model)
        {
            string result = string.Empty;
            try
            {
                DataTable dt = CouponsRepository.GetCounts();
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }
        [HttpGet]
        public JsonResult GetList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = CouponsRepository.GetList(model.strValue1, model.strValue2, model.strValue3, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, aaData = result }, 0);
        }
        [HttpPost]
        public JsonResult ChangeTrash(OrderPostStatusModel model)
        {
            string strID = model.strVal;
            if (strID != "")
            {
                CouponsRepository or = new CouponsRepository();
                or.ChangeTrash(model, strID);
                return Json(new { status = true, message = "Coupons has been move to trash successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Something went wrong", url = "" }, 0);
            }

        }

        public JsonResult GetDataByID(OrderPostStatusModel model)
        {
            string JSONresult = string.Empty;
            try
            {

                DataTable dt = CouponsRepository.GetDataByID(model);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

    }
}