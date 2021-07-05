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
        CouponsRepository Repo = null;
        public CouponsController()
        {
            Repo = new CouponsRepository();
        }
        // GET: Coupons
        public ActionResult Index()
        {
            return View("Coupons");
        }
        [HttpPost]
        public JsonResult NewUser(CouponsModel model)
        {
            if (ModelState.IsValid)
            {

                int ID = Repo.AddCoupons(model);
                    if (ID > 0)
                    {
                    AddCouponsMetaPost(model, ID);
                        ModelState.Clear();
                        return Json(new { status = true, message = "Coupons Record has been saved successfully!!", url = "", id = ID }, 0);
                    }
                    else
                    {
                        return Json(new { status = false, message = "Invalid Details", url = "", id = 0 }, 0);
                    }
                
            }
            return Json(new { status = false, message = "Invalid Details", url = "", id = 0 }, 0);
        }
        private void AddCouponsMetaPost(CouponsModel model, long id)
        {
            string[] varQueryArr1 = new string[15];
            string[] varFieldsName = new string[15] { "discount_type", "coupon_amount", "individual_use", "usage_limit", "usage_limit_per_user", "limit_usage_to_x_items", "usage_count", "date_expires", "free_shipping", "exclude_sale_items", "_wjecf_products_and", "_wjecf_categories_and", "_wjecf_is_auto_coupon", "_wjecf_apply_silently", "_used_by" };
            string[] varFieldsValue = new string[15] { model.discount_type, model.coupon_amount, model.individual_use, model.usage_limit, model.usage_limit_per_user, model.limit_usage_to_x_items, model.usage_count, model.date_expires.ToString(), model.free_shipping, model.exclude_sale_items, model._wjecf_products_and, model._wjecf_categories_and, model._wjecf_is_auto_coupon, model._wjecf_apply_silently, model._used_by};
            for (int n = 0; n < 15; n++)
            {
                Repo.AddCouponMeta(model, id, varFieldsName[n], varFieldsValue[n]);
            }
        }
        [HttpPost]
        public JsonResult GetProductList(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable DT = CouponsRepository.GetProducts(model.strValue1);
                JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch { }
            return Json(JSONresult, 0);
        }
    }
}