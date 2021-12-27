using LaylaERP.BAL;
using LaylaERP.Models;
using LaylaERP.UTILITIES;
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
            ViewBag.user_role = CommanUtilities.Provider.GetCurrent().UserType;
            return View("Coupons");
        }
        public ActionResult ManageCoupons()
        {
            ViewBag.user_role = CommanUtilities.Provider.GetCurrent().UserType;
            return View();
        }

        public ActionResult AutoGenerate()
        {
            return View();
        }
        public ActionResult NewAutoGenerate()
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

            DataTable dt = CouponsRepository.GetDuplicateCoupons(model);
            if (dt.Rows.Count > 0 && model.ID == 0)
            {
                return Json(new { status = false, message = "Coupon with the same code already exists", url = "" }, 0);
            }
            else
            {
                if (model.ID > 0)
                {
                    UserActivityLog.WriteDbLog(LogType.Submit, "Edit New Coupons", "/Coupons/Index" + ", " + Net.BrowserInfo);
                    CouponsRepository.EditCoupons(model, model.ID);
                    Update_MetaData(model, model.ID);
                    return Json(new { status = true, message = "Coupons record updated successfully!!", url = "Manage" }, 0);
                }
                else
                {
                    int ID = CouponsRepository.AddCoupons(model);
                    if (ID > 0)
                    {
                        UserActivityLog.WriteDbLog(LogType.Submit, "Save New Coupons", "/Coupons/Index" + ", " + Net.BrowserInfo);
                        Adduser_MetaData(model, ID);
                        ModelState.Clear();
                        return Json(new { status = true, message = "Coupons saved successfully!!", url = "" }, 0);
                    }
                    else
                    {
                        return Json(new { status = false, message = "Invalid details", url = "" }, 0);
                    }
                }
            }
        }

        [HttpPost]
        public JsonResult CreateAutoCoupons(CouponsModel model)
        {

            DataTable dt = CouponsRepository.GetDuplicateAutoCoupons(model);
            if (dt.Rows.Count > 0 && model.ID == 0)
            {
                return Json(new { status = false, message = "Coupon with the same code already exists", url = "" }, 0);
            }
            else
            {
                if (model.ID > 0)
                {
                    UserActivityLog.WriteDbLog(LogType.Submit, "Assign Coupon Update", "/Coupons/NewAutoGenerate/" + model.ID + "" + ", " + Net.BrowserInfo);
                    CouponsRepository.EditAutoCoupons(model, model.ID);
                    UpdateAuto_MetaData(model, model.ID);
                    return Json(new { status = true, message = "Coupons record updated successfully!!", url = "Manage" }, 0);
                }
                else
                {
                    int ID = CouponsRepository.AddAutoCoupons(model);
                    if (ID > 0)
                    {
                        UserActivityLog.WriteDbLog(LogType.Submit, "Assign Coupon", "/Coupons/NewAutoGenerate/" + ", " + Net.BrowserInfo);
                        AdduserAuto_MetaData(model, ID);
                        ModelState.Clear();
                        return Json(new { status = true, message = "Coupons saved successfully!!", url = "" }, 0);
                    }
                    else
                    {
                        return Json(new { status = false, message = "Invalid details", url = "" }, 0);
                    }
                }
            }
        }

        public JsonResult GetUser()
        {
            DataTable dt = new DataTable();
            dt = BAL.CouponsRepository.GetUser();
            List<SelectListItem> usertype = new List<SelectListItem>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                usertype.Add(new SelectListItem
                {
                    Value = dt.Rows[i]["rowid"].ToString(),
                    Text = dt.Rows[i]["name"].ToString()

                });
            }
            return Json(usertype, JsonRequestBehavior.AllowGet);
        }

        private void Adduser_MetaData(CouponsModel model, long id)
        {

            string[] varQueryArr1 = new string[20];
            string[] varFieldsName = new string[20] { "discount_type", "coupon_amount", "free_shipping", "minimum_amount", "maximum_amount", "individual_use", "exclude_sale_items", "_wjecf_is_auto_coupon", "product_ids", "exclude_product_ids", "product_categories", "exclude_product_categories", "usage_limit", "limit_usage_to_x_items", "usage_limit_per_user", "usage_count", "shareasale_wc_tracker_coupon_upload_enabled", "_wjecf_products_and", "_wjecf_categories_and", "customer_email" };
            string[] varFieldsValue = new string[20] { model.discount_type, model.coupon_amount, model.free_shipping, model.min_subtotal, model.max_subtotal, model.individual_use, model.exclude_sale_items, model.wjecf_is_auto_coupon, model.product_ids, model.exclude_product_ids, model.categories_ids, model.exclude_categories_ids, model.usage_limit, model.limit_usage_to_x_items, model.usage_limit_per_user, "0", "no", "no", "no", model.cus_email };
            for (int n = 0; n < 20; n++)
            {
                CouponsRepository.AddCouponMeta(model, id, varFieldsName[n], varFieldsValue[n]);
            }
            if (!string.IsNullOrEmpty(model.date_expires))
                CouponsRepository.AddexpiresMeta(model, id, "date_expires", model.date_expires.ToString());
            else
                CouponsRepository.AddexpiresMeta(model, id, "date_expires", null);

        }

        private void AdduserAuto_MetaData(CouponsModel model, long id)
        {
            //string[] varQueryArr1 = new string[21];
            //string[] varFieldsName = new string[21] { "discount_type", "coupon_amount", "free_shipping", "date_expires", "minimum_amount", "maximum_amount", "individual_use", "exclude_sale_items", "_wjecf_is_auto_coupon", "product_ids", "exclude_product_ids", "product_categories", "exclude_product_categories", "usage_limit", "limit_usage_to_x_items", "usage_limit_per_user", "usage_count", "shareasale_wc_tracker_coupon_upload_enabled", "_wjecf_products_and", "_wjecf_categories_and", "customer_email" };
            //string[] varFieldsValue = new string[21] { model.discount_type, model.coupon_amount, model.free_shipping, model.date_expires.ToString(), model.min_subtotal, model.max_subtotal, model.individual_use, model.exclude_sale_items, model.wjecf_is_auto_coupon, model.product_ids, model.exclude_product_ids, model.categories_ids, model.exclude_categories_ids, model.usage_limit, model.limit_usage_to_x_items, model.usage_limit_per_user,"0","no","no","no",model.cus_email };

            string[] varQueryArr1 = new string[21];
            string[] varFieldsName = new string[21] { "discount_type", "coupon_amount", "free_shipping", "minimum_amount", "maximum_amount", "individual_use", "exclude_sale_items", "_wjecf_is_auto_coupon", "product_ids", "exclude_product_ids", "product_categories", "exclude_product_categories", "usage_limit", "limit_usage_to_x_items", "usage_limit_per_user", "usage_count", "shareasale_wc_tracker_coupon_upload_enabled", "_wjecf_products_and", "_wjecf_categories_and", "customer_email", "_employee_id" };
            string[] varFieldsValue = new string[21] { model.discount_type, model.coupon_amount, model.free_shipping, model.min_subtotal, model.max_subtotal, model.individual_use, model.exclude_sale_items, model.wjecf_is_auto_coupon, model.product_ids, model.exclude_product_ids, model.categories_ids, model.exclude_categories_ids, model.usage_limit, model.limit_usage_to_x_items, model.usage_limit_per_user, "0", "no", "no", "no", model.cus_email, model._employee_id };
            for (int n = 0; n < 21; n++)
            {
                CouponsRepository.AddAutoCouponMeta(model, id, varFieldsName[n], varFieldsValue[n]);
            }
            //if(!string.IsNullOrEmpty(model.date_expires.ToString()))
            //{
            CouponsRepository.AddAutoexpiresMeta(model, id, "date_expires", model.date_expires.ToString());
            //}
        }

        private void Update_MetaData(CouponsModel model, long id)
        {
            //string[] varQueryArr1 = new string[21];
            //string[] varFieldsName = new string[21] { "discount_type", "coupon_amount", "free_shipping", "date_expires", "minimum_amount", "maximum_amount", "individual_use", "exclude_sale_items", "_wjecf_is_auto_coupon", "product_ids", "exclude_product_ids", "product_categories", "exclude_product_categories", "usage_limit", "limit_usage_to_x_items", "usage_limit_per_user", "usage_count", "shareasale_wc_tracker_coupon_upload_enabled", "_wjecf_products_and", "_wjecf_categories_and", "customer_email" };
            //string[] varFieldsValue = new string[21] { model.discount_type, model.coupon_amount, model.free_shipping, model.date_expires.ToString(), model.min_subtotal, model.max_subtotal, model.individual_use, model.exclude_sale_items, model.wjecf_is_auto_coupon, model.product_ids, model.exclude_product_ids, model.categories_ids, model.exclude_categories_ids, model.usage_limit, model.limit_usage_to_x_items, model.usage_limit_per_user, "0", "no", "no", "no", model.cus_email };

            string[] varQueryArr1 = new string[20];
            string[] varFieldsName = new string[20] { "discount_type", "coupon_amount", "free_shipping", "minimum_amount", "maximum_amount", "individual_use", "exclude_sale_items", "_wjecf_is_auto_coupon", "product_ids", "exclude_product_ids", "product_categories", "exclude_product_categories", "usage_limit", "limit_usage_to_x_items", "usage_limit_per_user", "usage_count", "shareasale_wc_tracker_coupon_upload_enabled", "_wjecf_products_and", "_wjecf_categories_and", "customer_email" };
            string[] varFieldsValue = new string[20] { model.discount_type, model.coupon_amount, model.free_shipping, model.min_subtotal, model.max_subtotal, model.individual_use, model.exclude_sale_items, model.wjecf_is_auto_coupon, model.product_ids, model.exclude_product_ids, model.categories_ids, model.exclude_categories_ids, model.usage_limit, model.limit_usage_to_x_items, model.usage_limit_per_user, "0", "no", "no", "no", model.cus_email };
            for (int n = 0; n < 20; n++)
            {
                CouponsRepository.UpdateMetaData(model, id, varFieldsName[n], varFieldsValue[n]);
            }
            if (!string.IsNullOrEmpty(model.date_expires))
                CouponsRepository.UpdateExpiresData(model, id, "date_expires", model.date_expires.ToString());
            else
                CouponsRepository.UpdateExpiresData(model, id, "date_expires", null);
        }

        private void UpdateAuto_MetaData(CouponsModel model, long id)
        {
            //string[] varQueryArr1 = new string[21];
            //string[] varFieldsName = new string[21] { "discount_type", "coupon_amount", "free_shipping", "date_expires", "minimum_amount", "maximum_amount", "individual_use", "exclude_sale_items", "_wjecf_is_auto_coupon", "product_ids", "exclude_product_ids", "product_categories", "exclude_product_categories", "usage_limit", "limit_usage_to_x_items", "usage_limit_per_user", "usage_count", "shareasale_wc_tracker_coupon_upload_enabled", "_wjecf_products_and", "_wjecf_categories_and", "customer_email" };
            //string[] varFieldsValue = new string[21] { model.discount_type, model.coupon_amount, model.free_shipping, model.date_expires.ToString(), model.min_subtotal, model.max_subtotal, model.individual_use, model.exclude_sale_items, model.wjecf_is_auto_coupon, model.product_ids, model.exclude_product_ids, model.categories_ids, model.exclude_categories_ids, model.usage_limit, model.limit_usage_to_x_items, model.usage_limit_per_user, "0", "no", "no", "no", model.cus_email };

            string[] varQueryArr1 = new string[21];
            string[] varFieldsName = new string[21] { "discount_type", "coupon_amount", "free_shipping", "minimum_amount", "maximum_amount", "individual_use", "exclude_sale_items", "_wjecf_is_auto_coupon", "product_ids", "exclude_product_ids", "product_categories", "exclude_product_categories", "usage_limit", "limit_usage_to_x_items", "usage_limit_per_user", "usage_count", "shareasale_wc_tracker_coupon_upload_enabled", "_wjecf_products_and", "_wjecf_categories_and", "customer_email", "_employee_id" };
            string[] varFieldsValue = new string[21] { model.discount_type, model.coupon_amount, model.free_shipping, model.min_subtotal, model.max_subtotal, model.individual_use, model.exclude_sale_items, model.wjecf_is_auto_coupon, model.product_ids, model.exclude_product_ids, model.categories_ids, model.exclude_categories_ids, model.usage_limit, model.limit_usage_to_x_items, model.usage_limit_per_user, "0", "no", "no", "no", model.cus_email, model._employee_id };
            for (int n = 0; n < 21; n++)
            {
                CouponsRepository.UpdateAutoMetaData(model, id, varFieldsName[n], varFieldsValue[n]);
            }
            // CouponsRepository.UpdateAutoExpiresData(model, id, "date_expires", model.date_expires.ToString());
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
                string usertype = CommanUtilities.Provider.GetCurrent().UserType;
                DataTable dt = new DataTable();
                int userid = Convert.ToInt32(CommanUtilities.Provider.GetCurrent().UserID);
                if (usertype.ToUpper() == "ADMINISTRATOR")
                {
                    dt = CouponsRepository.GetList(model.strValue1, model.strValue2, model.strValue3, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                    result = JsonConvert.SerializeObject(dt, Formatting.Indented);
                }
                else
                {
                    DateTime now = CommonDate.CurrentDate();

                    DateTime firstDayNextMonth = now.AddDays(-now.Day + 1).AddMonths(1);
                    // var now = DateTime.Now;
                    //var first = new DateTime(now.Year, now.Month+1, 1);
                    var Expiredate = firstDayNextMonth.Date.ToString("MM/dd/yyyy");
                    dt = CouponsRepository.GetListUserType(Expiredate, userid, model.strValue1, model.strValue2, model.strValue3, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                    result = JsonConvert.SerializeObject(dt, Formatting.Indented);
                }
            }
            catch { }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, aaData = result }, 0);
        }

        [HttpGet]
        public JsonResult AutoGenerateGetList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = new DataTable();
                dt = CouponsRepository.AutoGenerateGetList(model.strValue1, model.strValue2, model.strValue3, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
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
                UserActivityLog.WriteDbLog(LogType.Submit, "Coupon Bulk action (" + model.status + ")", "/Coupons/ManageCoupons/" + strID + "" + ", " + Net.BrowserInfo);

                return Json(new { status = true, message = "Coupons status changed successfully!!", url = "" }, 0);
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
        public JsonResult GetAutoDataByID(OrderPostStatusModel model)
        {
            string JSONresult = string.Empty;
            try
            {

                DataTable dt = CouponsRepository.GetAutoDataByID(model);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public JsonResult GetProdctByID(OrderPostStatusModel model)
        {
            string JSONresult = string.Empty;
            try
            {

                DataTable dt = CouponsRepository.GetProdctByID(model);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        public JsonResult GetCategoryProdctByID(OrderPostStatusModel model)
        {
            string JSONresult = string.Empty;
            try
            {

                DataTable dt = CouponsRepository.GetCategoryProdctByID(model);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        [HttpPost]
        public JsonResult GetProductList(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable DT = CouponsRepository.GetProductList(model.strValue1);
                JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        public JsonResult GetSelectProdctByID(OrderPostStatusModel model)
        {
            string JSONresult = string.Empty;
            try
            {

                DataTable dt = CouponsRepository.GetSelectProdctByID(model);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        [HttpPost]
        public JsonResult AutogenrateCoupon(OrderPostStatusModel model)
        {
            string month = model.strVal;
            string year = model.status;
            var date = Convert.ToDateTime("" + month + "/01/20" + year + "");
            // var monthval = new DateTime(date.Year, date.Month, 1);
            //  var first = monthval.AddMonths(1);
            // var last = monthval.AddMonths(1).AddDays(-1);
            // var Expiredate = last.Date.ToString("MM/dd/yyyy");
            // var Expiredated = last.Date.ToString("MM/dd/yyyy");

            var monthval = new DateTime(date.Year, date.Month, 1);
            var first = monthval.AddMonths(1);
            var Expiredate = first.Date.ToString("MM/dd/yyyy");

            if (month != "" && year != "" && Expiredate != "")
            {
                DataTable dt = CouponsRepository.GetDuplicateCouponsMonth(month + year);
                if (dt.Rows.Count > 0)
                {
                    return Json(new { status = false, message = "Coupon with the same month is already prepared", url = "" }, 0);
                }
                else
                {
                    UserActivityLog.WriteDbLog(LogType.Submit, "Save auto generate monthly coupon", "/Coupons/ManageCoupons" + ", " + Net.BrowserInfo);
                    CouponsRepository or = new CouponsRepository();
                    or.CoupanAutogenrate(month + year, Expiredate);
                    return Json(new { status = true, message = "Auto generate coupon prepared!!", url = "" }, 0);
                }
            }
            else
            {
                return Json(new { status = false, message = "Something went wrong", url = "" }, 0);
            }


        }
    }
}