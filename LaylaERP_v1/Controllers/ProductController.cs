using LaylaERP.BAL;
using LaylaERP.DAL;
using LaylaERP.Models;
using LaylaERP.UTILITIES;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.Dynamic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
//using System.Web.Script.Serialization;

namespace LaylaERP.Controllers
{
    public class ProductController : Controller
    {
        // Add Product
        public ActionResult AddNewProduct()
        {
            DataTable dt = new DataTable();
            // dt = BAL.ProductRepository.GetProductcategoriesList();
            string id = "";
            //dt = BAL.ProductRepository.GetParentCategory(id);
            List<SelectListItem> usertype = new List<SelectListItem>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                usertype.Add(new SelectListItem
                {
                    Value = dt.Rows[i]["ID"].ToString(),
                    Text = space(Convert.ToInt32(dt.Rows[i]["level"])) + dt.Rows[i]["name"].ToString()

                });
            }
            ViewBag.product = usertype.Select(N => new SelectListItem { Text = N.Text, Value = N.Value.ToString() });
            return View();
        }

        public string space(int noOfSpaces)
        {
            //try
            //{
            string returnValue = string.Empty;
            string space = "#";
            for (var index = 0; index < noOfSpaces; index++)
            {
                returnValue += space;
            }
            //}
            //catch { }
            return returnValue;
        }


        public ActionResult AddNewPurchase()
        {
            return View();
        }

        // Listing Products
        public ActionResult ListProduct()
        {
            return View();
        }

        // Products Categories
        public ActionResult ProductCategories()
        {
            return View();
        }

        // Products Attributes
        public ActionResult ProductAttributes()
        {
            return View();
        }

        // Shipping Class
        public ActionResult ShippingClass()
        {
            return View();
        }
        public ActionResult CalculateMargins()
        {
            return View();
        }
        //Listing Product opening stock
        public ActionResult ProductOpeningStock()
        {
            return View();
        }
        //Product opening stock
        public ActionResult AddProductOpeningStock()
        {
            return View();
        }
        [HttpPost]
        public JsonResult GetCount(SearchModel model)
        {
            string result = string.Empty;
            try
            {
                DataTable dt = ProductRepository.GetCounts();
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }
        public JsonResult GetCategoryType()
        {
            DataTable dt = new DataTable();
            dt = BAL.ProductRepository.GetCategoryType();
            List<SelectListItem> usertype = new List<SelectListItem>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                usertype.Add(new SelectListItem
                {
                    Value = dt.Rows[i]["term_id"].ToString(),
                    Text = dt.Rows[i]["NameCount"].ToString()

                });
            }
            return Json(usertype, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public JsonResult GetList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {

                DataTable dt = ProductRepository.GetList(model.strValue1, model.strValue2, model.strValue3, model.strValue4, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);

            }
            catch { }
            return Json(result, 0);
            //return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, aaData = result }, 0);
        }

        [HttpGet]
        public JsonResult Getcalculatemargins(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {

                DataTable dt = ProductRepository.Getcalculatemargins(model.strValue1, model.strValue2, model.strValue3, model.strValue4, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);

            }
            catch { }
            return Json(result, 0);
            //return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, aaData = result }, 0);
        }

        [HttpPost]
        public JsonResult Changestatus(OrderPostStatusModel model)
        {
            string strID = model.strVal;
            if (strID != "")
            {
                ProductRepository or = new ProductRepository();
                or.Changestatus(model, strID);
                return Json(new { status = true, message = "Product stats update successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Something went wrong", url = "" }, 0);
            }

        }


        [HttpGet]
        public JsonResult GetShippinfclassList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {

                DataTable dt = ProductRepository.GetShippinfclassList(model.strValue1, model.strValue2, model.strValue3, model.strValue4, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, aaData = result }, 0);
        }
        public JsonResult GetProductList(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable DT = ProductRepository.GetProducts(model.strValue1);
                JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public JsonResult GetProductVariant(int ID)
        {
            DataTable dt = new DataTable();
            dt = BAL.ProductRepository.GetProductVariant(ID);
            List<SelectListItem> usertype = new List<SelectListItem>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                usertype.Add(new SelectListItem
                {
                    Value = dt.Rows[i]["ID"].ToString(),
                    Text = dt.Rows[i]["Post_title"].ToString()

                });
            }
            if (usertype.Count == 0)
            {
                usertype.Add(new SelectListItem
                {
                    Value = ID.ToString(),
                    Text = "No Variation".ToString()

                });
            }
            return Json(usertype, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetProductCategory(int ID)
        {
            DataTable dt = new DataTable();
            dt = BAL.ProductRepository.GetProductcategoriesList();
            List<SelectListItem> usertype = new List<SelectListItem>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                usertype.Add(new SelectListItem
                {
                    Value = dt.Rows[i]["term_id"].ToString(),
                    Text = dt.Rows[i]["name"].ToString()

                });
            }
            return Json(usertype, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetVender(int ID)
        {
            DataTable dt = new DataTable();
            dt = BAL.ProductRepository.GetVender();
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
        public JsonResult GetShipping(int ID)
        {
            DataTable dt = new DataTable();
            dt = BAL.ProductRepository.GetShipping();
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
        public JsonResult GetShippingddl()
        {
            string JSONString = string.Empty;
            DataTable dt = new DataTable();
            dt = BAL.ProductRepository.GetShipping();
            JSONString = JsonConvert.SerializeObject(dt);
            return Json(JSONString, JsonRequestBehavior.AllowGet);
        }
        public JsonResult Getwarehouse()
        {
            DataTable dt = new DataTable();
            dt = BAL.ProductRepository.Getwarehouse();
            List<SelectListItem> usertype = new List<SelectListItem>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                usertype.Add(new SelectListItem
                {
                    Value = dt.Rows[i]["rowid"].ToString(),
                    Text = dt.Rows[i]["ref"].ToString()

                });
            }
            return Json(usertype, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult NewShipping(ProductModel model)
        {
            if (ModelState.IsValid)
            {
                int RoleID = new ProductRepository().CheckDuplicateShipping(model);
                if (RoleID == 0)
                {
                    int ID = new ProductRepository().AddNewShipping(model);
                    if (ID > 0)
                    {
                        ModelState.Clear();
                        return Json(new { status = true, message = "Shipping class saved successfully!!", url = "" }, 0);
                    }
                    else
                    {
                        return Json(new { status = false, message = "Invalid details", url = "" }, 0);
                    }
                }
                else
                {
                    return Json(new { status = false, message = "Shipping class can not be duplicate", url = "" }, 0);
                }

            }
            return Json(new { status = false, message = "Invalid details", url = "" }, 0);
        }

        public JsonResult deleteShippingprice(ProductModel model)
        {
            if (ModelState.IsValid)
            {

                int ID = new ProductRepository().deleteShippingprice(model);
                if (ID > 0)
                {
                    ModelState.Clear();
                    return Json(new { status = true, message = "Shipping class delete successfully!!", url = "" }, 0);
                }
                else
                {
                    return Json(new { status = false, message = "No data found for delete", url = "" }, 0);
                }
            }
            return Json(new { status = false, message = "Invalid details", url = "" }, 0);
        }
        public JsonResult BuyingPrice(ProductModel model)
        {
            JsonResult result = new JsonResult();
            DateTime dateinc = DateTime.Now;
            //DateTime dateinc = UTILITIES.CommonDate.CurrentDate();
            var resultOne = 0;
            // DataTable dt = ProductRepository.GetproductPurchase_Items(model);

            if (model.ID > 0)
            {
                UserActivityLog.WriteDbLog(LogType.Submit, "Update buying price", "/Product/AddNewProduct/" + model.ID + "" + ", " + Net.BrowserInfo);
                resultOne = ProductRepository.updateBuyingtProduct(model, dateinc);
            }
            else
            {
                //if (dt.Rows.Count > 0)
                //{
                //    return Json(new { status = false, message = "Vendor already allocated for this product", url = "" }, 0);
                //}
                //else
                //{
                UserActivityLog.WriteDbLog(LogType.Submit, "Add buying price", "/Product/AddNewProduct/" + ", " + Net.BrowserInfo);
                DataTable dtware = ProductRepository.Getwarehouse(model);
                if (dtware.Rows.Count > 0)
                {
                    resultOne = ProductRepository.AddBuyingtProduct(model, dateinc);
                }
                else
                {
                    resultOne = ProductRepository.AddBuyingtProduct(model, dateinc);
                    ProductRepository.AddBuyingtProductwarehouse(model, dateinc);
                }
                // }
            }
            if (resultOne > 0)
            {
                return Json(new { status = true, message = "Updated successfully!!", url = "Manage" }, 0);
            }
            else if (resultOne < 0)
            {
                return Json(new { status = true, message = "Today current price already added.!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid details", url = "" }, 0);
            }


        }
        public JsonResult Createwarehouse(ProductModel model)
        {
            JsonResult result = new JsonResult();
            DateTime dateinc = DateTime.Now;
            //DateTime dateinc = UTILITIES.CommonDate.CurrentDate();
            var resultOne = 0;
            DataTable dt = ProductRepository.Getproductwarehouse(model);

            //    resultOne = ProductRepository.updateProductwarehouse(model, dateinc);
            //else
            if (dt.Rows.Count > 0)
            {
                return Json(new { status = false, message = "Warehouse already allocated for this product", url = "" }, 0);
            }
            else
            {
                UserActivityLog.WriteDbLog(LogType.Submit, "Add warehouse to product " + model.fk_product + "", "/Product/AddNewProduct/" + ", " + Net.BrowserInfo);
                resultOne = ProductRepository.AddProductwarehouse(model);
                if (resultOne > 0)
                    return Json(new { status = true, message = "Save successfully!!", url = "Manage" }, 0);
                else
                    return Json(new { status = false, message = "Invalid details", url = "" }, 0);

            }
            //else
            //{
            //    return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            //}
        }
        public JsonResult GetStateData(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable DT = BAL.ProductRepository.GetStateData(model.strValue1, model.strValue2);
                JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        public JsonResult SelectedStateData(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable DT = BAL.ProductRepository.SelectedStateData(model.strValue1);
                JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public JsonResult GetCityStateData(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable DT = BAL.ProductRepository.GetCountryStateData(model.strValue1, model.strValue2);
                JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public JsonResult CreateNotes(ProductModel model)
        {
            JsonResult result = new JsonResult();
            DateTime dateinc = DateTime.Now;
            //DateTime dateinc = UTILITIES.CommonDate.CurrentDate();
            var resultOne = 0;
            //if (model.ID > 0)
            //    resultOne = ProductRepository.updateNotesProduct(model, dateinc);
            //else
            resultOne = ProductRepository.updateNotesProduct(model);
            if (resultOne > 0)
            {
                UserActivityLog.WriteDbLog(LogType.Submit, "Add note in add/edit product id(" + model.ID.ToString() + ")", "/Product/AddNewProduct/" + ", " + Net.BrowserInfo);
                return Json(new { status = true, message = "updated successfully!!", url = "Manage" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid details", url = "" }, 0);
            }
        }
        public JsonResult DeleteProductwarehouse(ProductModel model)
        {
            JsonResult result = new JsonResult();
            //DateTime dateinc = DateTime.Now;
            //DateTime dateinc = UTILITIES.CommonDate.CurrentDate();
            var resultOne = 0;
            // model.ID = model.strVal;
            if (model.ID > 0)
                resultOne = ProductRepository.DeleteProductwarehouse(model);
            if (resultOne > 0)
            {
                return Json(new { status = true, message = "In-Activated successfully!!", url = "Manage" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid details", url = "" }, 0);
            }
        }
        public JsonResult ActiveProductwarehouse(ProductModel model)
        {
            JsonResult result = new JsonResult();
            //DateTime dateinc = DateTime.Now;
            //DateTime dateinc = UTILITIES.CommonDate.CurrentDate();
            var resultOne = 0;
            // model.ID = model.strVal;
            if (model.ID > 0)
                resultOne = ProductRepository.ActiveProductwarehouse(model);
            if (resultOne > 0)
            {
                return Json(new { status = true, message = "Activated successfully !!", url = "Manage" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid details", url = "" }, 0);
            }
        }
        [HttpPost]
        public JsonResult CreateShipname(ProductModel model)
        {
            JsonResult result = new JsonResult();
            string msg = "";
            //int ID = 0;
            if (!string.IsNullOrEmpty(model.statecode))
            {
                string[] state = model.statecode.Split(',');
                for (int x = 0; x < state.Length; x++)
                {
                    model.statecode = state[x].Trim();
                    DataTable dt = ProductRepository.Getcountrystatecountry(model);
                    if (dt.Rows.Count > 0 && model.ID == 0)
                    {
                        return Json(new { status = false, message = "Shipping class with country state already existed", url = "" }, 0);
                    }
                    else
                    {

                        if (model.ID > 0)
                        {
                            model.statecode = state[x].Trim();
                            ProductRepository.updateshippingclass(model);
                            msg = "Details updated successfully!!";
                            //return Json(new { status = true, message = "", url = "Manage" }, 0);
                        }
                        else
                        {
                            model.statecode = state[x].Trim();
                            ProductRepository.AddshippingPricedetails(model);
                            //return Json(new { status = true, message = "Details has been saved successfully!!", url = "" }, 0);
                            msg = "Details save successfully!!";
                        }
                    }
                }
            }
            else
            {
                msg = "Please select state!!";
                //model.statecode = null;
                //DataTable dt = ProductRepository.Getcountrystatecountry(model);
                //if (dt.Rows.Count > 0 && model.ID == 0)
                //{
                //    return Json(new { status = false, message = "Shipping Class with country state has been already existed", url = "" }, 0);
                //}
                //else
                //{
                //    if (model.ID > 0)
                //    {
                //        model.statecode = null;
                //        ProductRepository.updateshippingclass(model);
                //        msg = "Details has been updated successfully!!";
                //        //return Json(new { status = true, message = "", url = "Manage" }, 0);
                //    }
                //    else
                //    {
                //        model.statecode = null;
                //        ProductRepository.AddshippingPricedetails(model);
                //        //return Json(new { status = true, message = "Details has been saved successfully!!", url = "" }, 0);
                //        msg = "Details has been save successfully!!";
                //    }
                //}
            }
            return Json(new { status = true, message = msg, url = "Manage" }, 0);

        }
        public JsonResult Deletefileuploade(ProductModel model)
        {
            JsonResult result = new JsonResult();
            //DateTime dateinc = DateTime.Now;
            //DateTime dateinc = UTILITIES.CommonDate.CurrentDate();
            var resultOne = 0;
            // model.ID = model.strVal;
            if (model.ID > 0)
                resultOne = ProductRepository.Deletefileuploade(model);
            if (resultOne > 0)
            {
                return Json(new { status = true, message = "Deleted successfully!!", url = "Manage" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid details", url = "" }, 0);
            }
        }
        public JsonResult DeleteBuyingPrice(ProductModel model)
        {
            JsonResult result = new JsonResult();
            //DateTime dateinc = DateTime.Now;
            //DateTime dateinc = UTILITIES.CommonDate.CurrentDate();
            var resultOne = 0;
            // model.ID = model.strVal;
            if (model.ID > 0)
                resultOne = ProductRepository.DeleteBuyingtProduct(model);
            if (resultOne > 0)
            {
                return Json(new { status = true, message = "In-Activated successfully!!", url = "Manage" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid details", url = "" }, 0);
            }
        }

        public JsonResult SetBuyingPrice(ProductModel model)
        {
            JsonResult result = new JsonResult();
            //DateTime dateinc = DateTime.Now;
            //DateTime dateinc = UTILITIES.CommonDate.CurrentDate();
            var resultOne = 0;
            // model.ID = model.strVal;
            if (model.ID > 0)
                resultOne = ProductRepository.SetBuyingPrice(model);
            if (resultOne > 0)
            {
                return Json(new { status = true, message = "Set default successfully!!", url = "Manage" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid details", url = "" }, 0);
            }
        }

        public JsonResult ActiveuyingPrice(ProductModel model)
        {
            JsonResult result = new JsonResult();
            //DateTime dateinc = DateTime.Now;
            //DateTime dateinc = UTILITIES.CommonDate.CurrentDate();
            var resultOne = 0;
            // model.ID = model.strVal;
            if (model.ID > 0)
                resultOne = ProductRepository.ActiveuyingPrice(model);
            if (resultOne > 0)
            {
                return Json(new { status = true, message = "Activated successfully!!", url = "Manage" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid details", url = "" }, 0);
            }
        }
        public JsonResult CreateProduct(ProductModel model)
        {
            if (model.ID > 0 || model.updatedID > 0)
            {
                long PID = model.ID > 0 ? model.ID : model.updatedID;
                UserActivityLog.WriteDbLog(LogType.Submit, "product id (" + PID + ") updated in list product", "/Product/AddNewProduct" + ", " + Net.BrowserInfo);
                model.post_type = "product";
                //  model.post_status = "publish";
                if (model.ID == 0)
                    model.ID = model.updatedID;
                if (!string.IsNullOrEmpty(model.post_content))
                    model.post_content = model.post_content;
                else
                    model.post_content = "";
                ProductRepository.EditProducts(model, model.ID);
                UpdateVariation_MetaData(model, model.ID);
                update_term(model, model.ID);
                if (model.updatedID > 0)
                    return Json(new { status = true, message = "Product record updated successfully!!", url = "" }, 0);
                else
                    return Json(new { status = true, message = "Product record updated successfully!!", url = "Manage" }, 0);
            }
            else
            {
                UserActivityLog.WriteDbLog(LogType.Submit, "New product (" + model.post_title + ") created in add new product", "/Product/AddNewProduct" + ", " + Net.BrowserInfo);
                // model.post_status = "publish";
                model.post_type = "product";
                model.comment_status = "open";
                if (!string.IsNullOrEmpty(model.post_content))
                    model.post_content = model.post_content;
                else
                    model.post_content = "";
                int ID = ProductRepository.AddProductDetails(model);
                if (ID > 0)
                {
                    Adduser_MetaData(model, ID);
                    Add_term(model, ID);
                    ModelState.Clear();
                    return Json(new { status = true, message = "Product saved successfully!!", url = "" }, 0);
                }
                else
                {
                    return Json(new { status = false, message = "Invalid details", url = "" }, 0);
                }
            }
        }

        private void Adduser_MetaData(ProductModel model, long id)
        {
            string[] varQueryArr1 = new string[30];
            string[] varFieldsName = new string[30] { "_sku", "_regular_price", "_sale_price", "total_sales", "_tax_status", "_tax_class", "_manage_stock", "_backorders", "_sold_individually", "_weight", "_length", "_width", "_height", "_upsell_ids", "_crosssell_ids", "_virtual", "_downloadable", "_download_limit", "_download_expiry", "_stock", "_stock_status", "_wc_average_rating", "_wc_review_count", "_price", "_low_stock_amount", "_product_attributes", "_gift_card", "_gift_card_expiration_days", "_gift_card_template_default_use_image", "_product_type_id" };
            string[] varFieldsValue = new string[30] { model.sku, model.regular_price, model.sale_price, "0", model.tax_status, model.tax_class, model.manage_stock, model.backorders, model.sold_individually, model.weight, model.length, model.width, model.height, model.upsell_ids, model.crosssell_ids, "no", "no", "-1", "-1", model.stock, model.stock_status, "0", "0", model.sale_price, model.low_stock_amount, model.product_attributes, model._gift_card, model._gift_card_expiration_days, model._gift_card_template_default_use_image, model._product_type_id };
            for (int n = 0; n < 30; n++)
            {
                ProductRepository.AddProductsMeta(model, id, varFieldsName[n], varFieldsValue[n]);
            }
        }
        private void AddVariant_MetaData(ProductModel model, long id)
        {
            string[] varQueryArr1 = new string[26];
            string[] varFieldsName = new string[26] { "_sku", "_regular_price", "_sale_price", "total_sales", "_tax_status", "_tax_class", "_manage_stock", "_backorders", "_sold_individually", "_weight", "_length", "_width", "_height", "_upsell_ids", "_crosssell_ids", "_virtual", "_downloadable", "_download_limit", "_download_expiry", "_stock", "_stock_status", "_wc_average_rating", "_wc_review_count", "_price", "_low_stock_amount", "_variation_description" };
            string[] varFieldsValue = new string[26] { model.sku, model.regular_price, model.sale_price, "0", model.tax_status, model.tax_class, model.manage_stock, model.backorders, model.sold_individually, model.weight, model.length, model.width, model.height, model.upsell_ids, model.crosssell_ids, "no", "no", "-1", "-1", model.stock, model.stock_status, "0", "0", model.sale_price, model.low_stock_amount, model.variation_description };
            for (int n = 0; n < 26; n++)
            {
                ProductRepository.AddProductsMeta(model, id, varFieldsName[n], varFieldsValue[n]);
            }
        }
        private void Addvariations_MetaData(ProductModel model, long id)
        {
            string[] varQueryArr1 = new string[26];
            string[] varFieldsName = new string[26] { "_sku", "_regular_price", "_sale_price", "total_sales", "_tax_status", "_tax_class", "_manage_stock", "_backorders", "_sold_individually", "_weight", "_length", "_width", "_height", "_upsell_ids", "_crosssell_ids", "_virtual", "_downloadable", "_download_limit", "_download_expiry", "_stock", "_stock_status", "_wc_average_rating", "_wc_review_count", "_price", "_low_stock_amount", "_variation_description" };
            string[] varFieldsValue = new string[26] { model.sku, model.regular_price, model.sale_price, "0", model.tax_status, model.tax_class, model.manage_stock, model.backorders, model.sold_individually, model.weight, model.length, model.width, model.height, model.upsell_ids, model.crosssell_ids, "no", "no", "-1", "-1", model.stock, model.stock_status, "0", "0", model.sale_price, model.low_stock_amount, model.variation_description };
            for (int n = 0; n < 26; n++)
            {
                ProductRepository.AddProductsMeta(model, id, varFieldsName[n], varFieldsValue[n]);
            }
        }
        private void Add_term(ProductModel model, int ID)
        {
            if (model.ProductTypeID > 0)
                ProductRepository.Add_term(model.ProductTypeID, ID);
            if (model.ShippingclassID > 0)
                ProductRepository.Add_Shipping(model.ShippingclassID, ID);
            string CommaStr = model.CategoryID;
            if (!string.IsNullOrEmpty(CommaStr))
            {
                var myarray = CommaStr.Split(',');
                for (var i = 0; i < myarray.Length; i++)
                {
                    ProductRepository.Add_term(Convert.ToInt32(myarray[i]), ID);
                    ProductRepository.update_countinc(Convert.ToInt32(myarray[i]), Convert.ToInt32(ID));

                }
            }
        }
        private void update_term(ProductModel model, long ID)
        {
            update_countdes(model, ID);
            delete_term(model, ID);
            ProductRepository.Add_term(model.ProductTypeID, Convert.ToInt32(ID));
            ProductRepository.Add_Shipping(model.ShippingclassID, Convert.ToInt32(ID));
            string CommaStr = model.CategoryID;

            var myarray = CommaStr.Split(',');

            for (var i = 0; i < myarray.Length; i++)
            {
                if (string.IsNullOrEmpty(myarray[i]) || myarray[i] == "undefined" || myarray[i] == "")
                {

                }
                else
                {

                    ProductRepository.Add_term(Convert.ToInt32(myarray[i]), Convert.ToInt32(ID));
                    ProductRepository.update_countinc(Convert.ToInt32(myarray[i]), Convert.ToInt32(ID));
                }
            }
        }
        private void update_countdes(ProductModel model, long ID)
        {
            string CommaStr = new ProductRepository().GetCountforupdate(ID);

            var myarray = CommaStr.Split(',');

            for (var i = 0; i < myarray.Length; i++)
            {
                if (myarray[i] == "")
                {

                }
                else
                {
                    ProductRepository.update_count(Convert.ToInt32(myarray[i]), Convert.ToInt32(ID));
                }
            }
        }
        private void delete_term(ProductModel model, long ID)
        {
            ProductRepository.Edit_term(model.ProductTypeID, Convert.ToInt32(ID));
            //ProductRepository.Edit_term(model.ShippingclassID, Convert.ToInt32(ID));
            //string CommaStr = model.CategoryID;

            //var myarray = CommaStr.Split(',');

            //for (var i = 0; i < myarray.Length; i++)
            //{
            //    ProductRepository.Edit_term(Convert.ToInt32(myarray[i]), Convert.ToInt32(ID));

            //}
        }


        private void Update_MetaData(ProductModel model, long id)
        {
            string[] varQueryArr1 = new string[21];
            string[] varFieldsName = new string[25] { "_sku", "_regular_price", "_sale_price", "total_sales", "_tax_status", "_tax_class", "_manage_stock", "_backorders", "_sold_individually", "_weight", "_length", "_width", "_height", "_upsell_ids", "_crosssell_ids", "_virtual", "_downloadable", "_download_limit", "_download_expiry", "_stock", "_stock_status", "_wc_average_rating", "_wc_review_count", "_price", "_low_stock_amount" };
            string[] varFieldsValue = new string[25] { model.sku, model.regular_price, model.sale_price, "0", model.tax_status, model.tax_class, model.manage_stock, model.backorders, model.sold_individually, model.weight, model.length, model.width, model.height, model.upsell_ids, model.crosssell_ids, "no", "no", "-1", "-1", model.stock, model.stock_status, "0", "0", model.sale_price, model.low_stock_amount };
            for (int n = 0; n < 25; n++)
            {
                ProductRepository.UpdateMetaData(model, id, varFieldsName[n], varFieldsValue[n]);
            }
        }

        private void UpdateVariation_MetaData(ProductModel model, long id)
        {
            string[] varQueryArr1 = new string[29];
            string[] varFieldsName = new string[29] { "_sku", "_regular_price", "_sale_price", "total_sales", "_tax_status", "_tax_class", "_manage_stock", "_backorders", "_sold_individually", "_weight", "_length", "_width", "_height", "_upsell_ids", "_crosssell_ids", "_virtual", "_downloadable", "_download_limit", "_download_expiry", "_stock", "_stock_status", "_wc_average_rating", "_wc_review_count", "_low_stock_amount", "_gift_card", "_gift_card_expiration_days", "_gift_card_template_default_use_image", "_product_type_id", "_price" };
            string[] varFieldsValue = new string[29] { model.sku, model.regular_price, model.sale_price, "0", model.tax_status, model.tax_class, model.manage_stock, model.backorders, model.sold_individually, model.weight, model.length, model.width, model.height, model.upsell_ids, model.crosssell_ids, "no", "no", "-1", "-1", model.stock, model.stock_status, "0", "0", model.low_stock_amount, model._gift_card, model._gift_card_expiration_days, model._gift_card_template_default_use_image, model._product_type_id, model.sale_price };
            for (int n = 0; n < 29; n++)
            {
                ProductRepository.UpdateMetaData(model, id, varFieldsName[n], varFieldsValue[n]);
            }
        }
        private void Update_AttributeMetaData(ProductModel model, long id)
        {
            string[] varQueryArr1 = new string[1];
            string[] varFieldsName = new string[1] { "_product_attributes" };
            string[] varFieldsValue = new string[1] { model.product_attributes };
            for (int n = 0; n < 1; n++)
            {
                ProductRepository.UpdateMetaData(model, id, varFieldsName[n], varFieldsValue[n]);
            }
        }

        public JsonResult GetDataByID(OrderPostStatusModel model)
        {
            string JSONresult = string.Empty;
            dynamic obj = new ExpandoObject();
            try
            {
                LaylaERP.UTILITIES.Serializer serializer = new LaylaERP.UTILITIES.Serializer();
                DataSet ds = ProductRepository.GetDataByID(model);
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    obj.ID = dr["ID"];
                    obj.post_name = dr["post_name"];
                    obj.post_title = dr["post_title"];
                    obj.post_content = dr["post_content"];
                    obj.post_excerpt = dr["post_excerpt"];
                    obj.guid = dr["guid"];
                    obj.post_status = dr["post_status"];
                    obj.publish_date = dr["publish_date"];
                    //
                    obj.product_type = dr["product_type"];
                    //Postmeta
                    obj.sku = dr["sku"];
                    obj.price = dr["price"];
                    obj.regular_price = dr["regular_price"];
                    obj.sale_price = dr["sale_price"];
                    obj.manage_stock = dr["manage_stock"];
                    obj.backorders = dr["backorders"];
                    obj.stock = dr["stock"];
                    obj.stock_status = dr["stock_status"];
                    obj.sold_individually = dr["sold_individually"];
                    obj.low_stock_amount = dr["low_stock_amount"];
                    obj.children = dr["children"];
                    obj.core_price = dr["core_price"];
                    obj.weight = dr["weight"];
                    obj.length = dr["length"];
                    obj.width = dr["width"];
                    obj.height = dr["height"];
                    obj.weight_unit = dr["weight_unit"];
                    obj.dimension_unit = dr["dimension_unit"];
                    obj.tax_status = dr["tax_status"];
                    obj.tax_class = dr["tax_class"];
                    obj.product_type_id = dr["product_type_id"];
                    obj.image = dr["image"];
                    obj.categories = dr["categories"];
                    //obj.variations = dr["variations"];
                    obj.variations = new List<dynamic>();
                    foreach (DataRow dr_v in ds.Tables[1].Rows)
                    {
                        var vr = new
                        {
                            ID = dr_v["ID"],
                            post_name = dr_v["post_name"],
                            post_title = dr_v["post_title"],
                            product_type = dr_v["product_type"],
                            //Postmeta
                            sku = dr_v["sku"],
                            price = dr_v["price"],
                            regular_price = dr_v["regular_price"],
                            sale_price = dr_v["sale_price"],
                            manage_stock = dr_v["manage_stock"],
                            backorders = dr_v["backorders"],
                            stock = dr_v["stock"],
                            stock_status = dr_v["stock_status"],
                            core_price = dr_v["core_price"],
                            weight = dr_v["weight"],
                            length = dr_v["length"],
                            width = dr_v["width"],
                            height = dr_v["height"],
                            tax_status = dr_v["tax_status"],
                            image = new { name = dr_v["img"], height = 0, width = 0, filesize = 0 },
                            attributes = !string.IsNullOrEmpty(dr_v["attributes"].ToString()) ? JsonConvert.DeserializeObject<dynamic>(dr_v["attributes"].ToString()) : JsonConvert.DeserializeObject<dynamic>("{}")
                        };
                        obj.variations.Add(vr);
                    }

                    if (!string.IsNullOrEmpty(dr["attributes"].ToString()))
                    {
                        obj.attributes = new List<dynamic>();
                        System.Collections.Hashtable _att = serializer.Deserialize(dr["attributes"].ToString()) as System.Collections.Hashtable;
                        foreach (System.Collections.DictionaryEntry att in _att)
                        {
                            System.Collections.Hashtable _att_value = (System.Collections.Hashtable)att.Value;
                            DataRow[] rows = ds.Tables[2].Select("attribute_name = '" + att.Key.ToString().Replace("pa_", "") + "'", "");
                            if (_att_value["is_taxonomy"].ToString().Equals("0"))
                            {
                                obj.attributes.Add(new { is_taxonomy = false, is_visible = _att_value["is_visible"], is_variation = _att_value["is_variation"], taxonomy_name = att.Key, display_name = _att_value["name"], attribute_type = "text", option = _att_value["value"] });
                            }
                            else
                            {
                                if (rows.Length > 0) obj.attributes.Add(new { is_taxonomy = true, is_visible = _att_value["is_visible"], is_variation = _att_value["is_variation"], taxonomy_name = att.Key, display_name = rows[0]["attribute_label"], attribute_type = rows[0]["attribute_type"], option = (!string.IsNullOrEmpty(rows[0]["term"].ToString()) ? JsonConvert.DeserializeObject<List<dynamic>>(rows[0]["term"].ToString()) : JsonConvert.DeserializeObject<List<dynamic>>("[]")) });
                                else obj.attributes.Add(new { is_taxonomy = true, is_visible = _att_value["is_visible"], is_variation = _att_value["is_variation"], taxonomy_name = att.Key, display_name = _att_value["name"], attribute_type = "select", option = new List<dynamic>() });
                            }
                        }
                    }
                }
                JSONresult = JsonConvert.SerializeObject(obj);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        public JsonResult GetDataBuyingByID(OrderPostStatusModel model)
        {
            string JSONresult = string.Empty;
            try
            {

                DataTable dt = ProductRepository.GetDataBuyingByID(model);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        public JsonResult GetShipEditDataID(OrderPostStatusModel model)
        {
            string JSONresult = string.Empty;
            try
            {

                DataTable dt = ProductRepository.GetShipEditDataID(model);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        public JsonResult GetDataProductwarehouseByID(OrderPostStatusModel model)
        {
            string JSONresult = string.Empty;
            try
            {

                DataTable dt = ProductRepository.GetDataProductwarehouseByID(model);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public JsonResult GetPurchaseDataByID(OrderPostStatusModel model)
        {
            string JSONresult = string.Empty;
            try
            {

                DataTable dt = ProductRepository.GetPurchaseDataByID(model);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        public JsonResult GetPurchaseDetailsDataByID(OrderPostStatusModel model)
        {
            string JSONresult = string.Empty;
            try
            {

                DataTable dt = ProductRepository.GetPurchaseDetailsDataByID(model);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        [HttpPost]
        public ActionResult FileUploade(string Name, HttpPostedFileBase ImageFileproductlink)
        {
            try
            {

                if (ImageFileproductlink != null)
                {

                    ProductModel model = new ProductModel();
                    //Use Namespace called :  System.IO  
                    string FileName = Path.GetFileNameWithoutExtension(ImageFileproductlink.FileName);
                    FileName = Regex.Replace(FileName, @"\s+", "");
                    //To Get File Extension  
                    long filesize = ImageFileproductlink.ContentLength / 1024;
                    string FileExtension = Path.GetExtension(ImageFileproductlink.FileName);
                    if (FileExtension == ".xlsx" || FileExtension == ".xls" || FileExtension == ".XLS" || FileExtension == ".pdf" || FileExtension == ".PDF" || FileExtension == ".doc" || FileExtension == ".docx" || FileExtension == ".png" || FileExtension == ".PNG" || FileExtension == ".jpg" || FileExtension == ".JPG" || FileExtension == ".jpeg" || FileExtension == ".JPEG" || FileExtension == ".bmp" || FileExtension == ".BMP")
                    {
                        //Add Current Date To Attached File Name  
                        //FileName = DateTime.Now.ToString("yyyyMMdd") + "-" + FileName.Trim() + FileExtension;

                        FileName = FileName.Trim() + FileExtension;
                        string FileNameForsave = FileName;


                        DataTable dt = ProductRepository.GetfileCountdata(Convert.ToInt32(Name), FileName);
                        if (dt.Rows.Count > 0)
                        {
                            return Json(new { status = false, message = "File already uploaded", url = "" }, 0);
                        }
                        else
                        {

                            string UploadPath = Path.Combine(Server.MapPath("~/Files"));
                            UploadPath = UploadPath + "\\";
                            //Its Create complete path to store in server.  
                            model.ImagePath = UploadPath + FileName;
                            //To copy and save file into server.  
                            ImageFileproductlink.SaveAs(model.ImagePath);
                            var ImagePath = "~/Files/" + FileName;
                            int resultOne = ProductRepository.FileUploade(Convert.ToInt32(Name), FileName, filesize.ToString(), FileExtension, ImagePath);

                            if (resultOne > 0)
                            {
                                return Json(new { status = true, message = "File upload successfully!!", url = "Manage" }, 0);
                            }
                            else
                            {
                                return Json(new { status = false, message = "Invalid details", url = "" }, 0);
                            }
                        }
                    }

                    else
                    {
                        return Json(new { status = false, message = "File type " + FileExtension + " not allowed", url = "" }, 0);
                    }
                }
                else
                {
                    return Json(new { status = false, message = "Please attach a document", url = "" }, 0);
                }
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = "Invalid details", url = "" }, 0);
            }

        }



        [HttpPost]
        public JsonResult GetProductInfo(SearchModel model)
        {
            List<ProductsModelDetails> obj = new List<ProductsModelDetails>();
            try
            {
                obj = ProductRepository.GetProductListDetails(model.strValue1, model.strValue2);
            }
            catch { }
            return Json(obj, 0);
        }

        public JsonResult GetProductservices(SearchModel model)
        {
            List<ProductModelservices> obj = new List<ProductModelservices>();
            try
            {
                obj = ProductRepository.GetProductservices(model.strValue1, model.strValue2);
            }
            catch { }
            return Json(obj, 0);
        }
        public JsonResult GetComponentProductservices(SearchModel model)
        {
            List<ProductModelservices> obj = new List<ProductModelservices>();
            try
            {
                obj = ProductRepository.GetComponentProductservices(model.strValue1, model.strValue2);
            }
            catch { }
            return Json(obj, 0);
        }

        public JsonResult GetProductParent(SearchModel model)
        {
            List<ProductModelservices> obj = new List<ProductModelservices>();
            try
            {
                obj = ProductRepository.GetProductParent(model.strValue1, model.strValue2);
            }
            catch { }
            return Json(obj, 0);
        }
        public JsonResult GetwarehouseData(SearchModel model)
        {
            List<ProductModelservices> obj = new List<ProductModelservices>();
            try
            {
                obj = ProductRepository.GetwarehouseData(model.strValue1, model.strValue2);
            }
            catch { }
            return Json(obj, 0);
        }

        public JsonResult GetfileuploadData(SearchModel model)
        {
            List<ProductModelservices> obj = new List<ProductModelservices>();
            try
            {
                obj = ProductRepository.GetfileuploadData(model.strValue1, model.strValue2);
            }
            catch { }
            return Json(obj, 0);
        }
        public JsonResult GetBuyingdata(SearchModel model)
        {
            List<ProductByingPrice> obj = new List<ProductByingPrice>();
            try
            {
                obj = ProductRepository.GetBuyingdata(model.strValue1, model.strValue2);
            }
            catch { }
            return Json(obj, 0);
        }

        public JsonResult GetDataVariationByID(OrderPostStatusModel model)
        {
            string JSONresult = string.Empty;
            try
            {

                DataTable dt = ProductRepository.GetDataVariationByID(model);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        public JsonResult Getproductattributes(OrderPostStatusModel model)
        {
            string JSONresult = string.Empty;
            try
            {

                string atrribute = ProductRepository.GetProductAttributeID(model);
                JSONresult = JsonConvert.SerializeObject(atrribute);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        public JsonResult GetProdctByID(OrderPostStatusModel model)
        {
            string JSONresult = string.Empty;
            try
            {

                DataTable dt = ProductRepository.GetProdctByID(model);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public JsonResult savevariantproduct(string fields, string parentid, ProductModel model)
        {
            string[] attributeheader = fields.Split(',');
            string varFieldsName = string.Empty;
            string varFieldsValue = string.Empty;




            model.post_content = "";
            model.post_type = "product_variation";
            model.comment_status = "closed";

            if (!string.IsNullOrEmpty(parentid))
                model.post_parent = Convert.ToInt32(parentid);
            else
                model.post_parent = 0;
            model.post_status = "publish";
            model.post_title = "";
            model.post_name = "";


            int ID = ProductRepository.AddProducts(model);
            ViewBag.UpdatedID = ID;
            if (ID > 0)
            {
                AddVariant_MetaData(model, ID);
                ModelState.Clear();
                for (int y = 0; y < attributeheader.Length; y++)
                {
                    varFieldsName = "attribute_" + attributeheader[y].Trim().ToLower();
                    ProductRepository.AddProductsMetaVariation(Convert.ToInt64(ID), varFieldsName, "");
                }
                return Json(new { status = true, message = "Product attributes saved successfully!!", ID = ID }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid details", id = ID }, 0);
            }



            //return Json(new { status = true, message = "Product Attributes has been saved successfully!!", ID = ID }, 0);

        }
        public JsonResult saveAttributes(string fields, string IDs, string post_title, string table, string visible, string variation, string producttypeID, ProductModel model)
        {
            model.product_attributes = fields;
            if ((IDs != "NaN"))
            {

                // ProductRepository.EditProducts(model, model.ID);
                Update_AttributeMetaData(model, Convert.ToInt64(IDs));
                //update_term(model, model.ID);
                return Json(new { status = true, message = "Product attributes updated successfully!!", url = "Manage" }, 0);
            }
            else
            {
                model.post_status = "draft";
                if (!string.IsNullOrEmpty(model.post_content))
                    model.post_content = model.post_content;
                else
                    model.post_content = "";
                model.post_title = post_title;
                model.post_name = post_title;
                model.post_type = "product";
                model.comment_status = "open";
                int ID = ProductRepository.AddProducts(model);
                ViewBag.UpdatedID = ID;
                if (ID > 0)
                {
                    Adduser_MetaData(model, ID);
                    ProductRepository.Add_term(Convert.ToInt32(producttypeID), ID);
                    //Add_term(model, ID);
                    ModelState.Clear();
                    return Json(new { status = true, message = "Product attributes saved successfully!!", ID = ID }, 0);
                }
                else
                {
                    return Json(new { status = false, message = "Invalid details", id = ID }, 0);
                }
            }

            //return Json(model, JsonRequestBehavior.AllowGet);
        }

        //public JsonResult Savevariations(string fields,string UpdateList, string UpdateID, string PID, string post_title,string regularprice, string Salepricevariationval, string Stockquantityvariationval, string allowbackordersvariationval, string weightvariationval, string Lvariationval, string Wvariationval, string Hvariationval, string shipvariationval, string cassvariationval, string descriptionvariationval, string stockchec, string chkvirtual, string sku, string parentid, string attributeheaderval , ProductModel model)
        //{
        [HttpPost]
        public JsonResult Savevariations(ProductModel model)
        {

            string result = string.Empty;
            bool status = false;
            try
            {
                int res = ProductRepository.UpdateVariantStatus(model.ProductPostMeta);
                if (res > 0)
                {
                    status = true;
                }

                //  int resl = ProductRepository.UpdateItemVariantStatus(model.ProductPostItemMeta);

                int resl = ProductRepository.UpdateshippingVariantStatus(model.ProductPostItemMeta);

                int respost = ProductRepository.UpdatePostStatus(model.ProductPostPostMeta);

                int reprice = ProductRepository.addprice(model.ProductPostPriceMeta);
            }
            catch { status = false; result = ""; }
            return Json(new { status = true, message = "Product variations update successfully!!", ID = 1 }, 0);

            // fields.ProductPostMeta
            // model.ProductPostMeta = Convert. fields.ToList(); 

            // model1.ProductPostMeta.Add(new ProductModelMetaModel() { post_id = model.OrderPostStatus.order_id, meta_key = ProductModelMetaModel., meta_value = ProductModelMetaModel });

            //List<char> charList = fields.ToCharArray().ToList();

            // var model1 = JsonConvert.DeserializeObject<RootObject>(json);

            ////string value = "";
            ////string[] skuval = sku.Split(',');

            ////string[] regularpriceval = regularprice.Split(',');
            ////string[] Salepricl = Salepricevariationval.Split(',');

            ////string[] weightvariation = weightvariationval.Split(',');
            ////string[] Lvariation = Lvariationval.Split(',');
            ////string[] Wvariation = Wvariationval.Split(',');
            ////string[] Hvariation = Hvariationval.Split(',');

            ////string[] Stockquantityvariation = Stockquantityvariationval.Split(',');
            ////string[] allowbackordersvariation = allowbackordersvariationval.Split(',');
            ////string[] shipvariation = shipvariationval.Split(',');
            ////string[] cassvariation = cassvariationval.Split(',');

            ////string[] descriptionvariation = descriptionvariationval.Split(',');
            ////string[] stockchecval = stockchec.Split(',');
            ////string[] chkvirtu = chkvirtual.Split(',');
            ////// attributeheaderval = "Size,Color";
            ////string[] attributeheader = attributeheaderval.Split(',');
            ////string[] UpdateListval = UpdateList.Split(',');
            ////string varFieldsName = string.Empty;
            ////string varFieldsValue = string.Empty;
            ////// return Json(new { status = true, message = "Product Variations has been saved successfully!!", ID = 1 }, 0);
            ////if (!string.IsNullOrEmpty(PID))
            ////{
            ////    string[] UpdateIDs = UpdateID.Split(',');
            ////    string[] elements = fields.Split(',');

            ////    for (int x = 0; x < UpdateIDs.Length; x++)
            ////    {
            ////        for (int y = 0; y < UpdateListval.Length; y++)
            ////        {
            ////            varFieldsName = "attribute_" + UpdateListval[y];
            ////            int r = 0;
            ////            if (x > 0)
            ////            {
            ////                if (x == 2)
            ////                {
            ////                    if (y > 0)
            ////                        r = x + 3;
            ////                    else
            ////                        r = x + 2;
            ////                }
            ////                else
            ////                {
            ////                    if (y > 0)
            ////                        r = x + 2;
            ////                    else
            ////                        r = x + 1;
            ////                }
            ////            }
            ////            else
            ////                r = y;

            ////            for (int z = r; z < elements.Length; z++)
            ////            {
            ////                varFieldsValue = elements[z];
            ////                ProductRepository.UpdateProductsMetaVariation(Convert.ToInt64(UpdateIDs[x]), varFieldsName, varFieldsValue);
            ////                ProductRepository.UpdateProductsVariation(model.post_title + "-" + varFieldsValue, UpdateListval[y] + ": " + varFieldsValue, Convert.ToInt64(UpdateIDs[x]));
            ////                break;
            ////            }

            ////        }
            ////    }

            ////    for (int x = 0; x < UpdateIDs.Length; x++)
            ////    {
            ////        for (int y = x; y < regularpriceval.Length; y++)
            ////        {

            ////            varFieldsName = "_regular_price";
            ////            varFieldsValue = regularpriceval[y];
            ////            ProductRepository.UpdateProductsMetaVariation(Convert.ToInt64(UpdateIDs[x]), varFieldsName, varFieldsValue);

            ////            break;
            ////        }
            ////        for (int z = x; z < Salepricl.Length; z++)
            ////        {
            ////            varFieldsName = "_sale_price";
            ////            varFieldsValue = Salepricl[z];
            ////            ProductRepository.UpdateProductsMetaVariation(Convert.ToInt64(UpdateIDs[x]), varFieldsName, varFieldsValue);

            ////            break;
            ////        }
            ////        for (int w = x; w < skuval.Length; w++)
            ////        {
            ////            varFieldsName = "_sku";
            ////            varFieldsValue = skuval[w];
            ////            ProductRepository.UpdateProductsMetaVariation(Convert.ToInt64(UpdateIDs[x]), varFieldsName, varFieldsValue);

            ////            break;
            ////        }

            ////        for (int a = x; a < weightvariation.Length; a++)
            ////        {

            ////            varFieldsName = "_weight";
            ////            varFieldsValue = weightvariation[a];
            ////            ProductRepository.UpdateProductsMetaVariation(Convert.ToInt64(UpdateIDs[x]), varFieldsName, varFieldsValue);
            ////            break;
            ////        }
            ////        for (int b = x; b < Lvariation.Length; b++)
            ////        {
            ////            varFieldsName = "_length";
            ////            varFieldsValue = Lvariation[b];
            ////            ProductRepository.UpdateProductsMetaVariation(Convert.ToInt64(UpdateIDs[x]), varFieldsName, varFieldsValue);
            ////            break;
            ////        }
            ////        for (int c = x; c < Wvariation.Length; c++)
            ////        {
            ////            varFieldsName = "_width";
            ////            varFieldsValue = Wvariation[c];
            ////            ProductRepository.UpdateProductsMetaVariation(Convert.ToInt64(UpdateIDs[x]), varFieldsName, varFieldsValue);
            ////            break;
            ////        }
            ////        for (int d = x; d < Hvariation.Length; d++)
            ////        {
            ////            varFieldsName = "_height";
            ////            varFieldsValue = Hvariation[d];
            ////            ProductRepository.UpdateProductsMetaVariation(Convert.ToInt64(UpdateIDs[x]), varFieldsName, varFieldsValue);
            ////            break;
            ////        }
            ////        for (int e = x; e < cassvariation.Length; e++)
            ////        {

            ////            varFieldsName = "_tax_class";
            ////            varFieldsValue = cassvariation[e];
            ////            ProductRepository.UpdateProductsMetaVariation(Convert.ToInt64(UpdateIDs[x]), varFieldsName, varFieldsValue);
            ////            break;
            ////        }
            ////        for (int f = x; f < allowbackordersvariation.Length; f++)
            ////        {
            ////            varFieldsName = "_backorders";
            ////            varFieldsValue = allowbackordersvariation[f];
            ////            ProductRepository.UpdateProductsMetaVariation(Convert.ToInt64(UpdateIDs[x]), varFieldsName, varFieldsValue);

            ////            break;
            ////        }
            ////        for (int g = x; g < Stockquantityvariation.Length; g++)
            ////        {
            ////            varFieldsName = "_stock";
            ////            varFieldsValue = Stockquantityvariation[g];
            ////            ProductRepository.UpdateProductsMetaVariation(Convert.ToInt64(UpdateIDs[x]), varFieldsName, varFieldsValue);

            ////            break;
            ////        }
            ////        for (int h = x; h < descriptionvariation.Length; h++)
            ////        {
            ////            varFieldsName = "_variation_description";
            ////            varFieldsValue = descriptionvariation[h];
            ////            ProductRepository.UpdateProductsMetaVariation(Convert.ToInt64(UpdateIDs[x]), varFieldsName, varFieldsValue);

            ////            break;
            ////        }

            ////        for (int i = x; i < shipvariation.Length; i++)
            ////        {
            ////            ProductRepository.Edit_term(Convert.ToInt32(shipvariation[i]), Convert.ToInt32(UpdateIDs[x]));
            ////            ProductRepository.Add_term(Convert.ToInt32(shipvariation[i]), Convert.ToInt32(UpdateIDs[x]));
            ////            break;
            ////        }
            ////    }
            ////    return Json(new { status = true, message = "Product Variations has been updated successfully!!", url = "Manage" }, 0);
            ////}
            ////else
            ////{
            ////    string[] elements = fields.Split(',');

            ////    model.post_status = "publish";
            ////    model.post_type = "product";
            ////    model.post_content = "";
            ////    model.post_title = post_title;
            ////    model.post_name = post_title;
            ////    model.post_type = "product_variation";
            ////    model.comment_status = "closed";

            ////    if (!string.IsNullOrEmpty(parentid))
            ////        model.post_parent = Convert.ToInt32(parentid);
            ////    else
            ////        model.post_parent = 0;


            ////    foreach (string Skulistval in skuval)
            ////    {
            ////        int ID = ProductRepository.AddProducts(model);
            ////        if (ID > 0)
            ////        {
            ////            value += ID + ",";

            ////        }
            ////        else
            ////        {
            ////            value = "";
            ////        }
            ////    }
            ////    string pricevalereg = "";
            ////    string PostID = value.TrimEnd(',');

            ////    // string PostID = "1,2,3";
            ////    string[] PostIDs = PostID.Split(',');


            ////    for (int x = 0; x < PostIDs.Length; x++)
            ////    {
            ////        for (int y = 0; y < attributeheader.Length; y++)
            ////        {
            ////            varFieldsName = "attribute_" + attributeheader[y];
            ////            int r = 0;
            ////            if (x > 0)
            ////            {
            ////                if (x == 2)
            ////                {
            ////                    if (y > 0)
            ////                        r = x + 3;
            ////                    else
            ////                        r = x + 2;
            ////                }
            ////                else
            ////                {
            ////                    if (y > 0)
            ////                        r = x + 2;
            ////                    else
            ////                        r = x + 1;
            ////                }
            ////            }
            ////            else
            ////                r = y;

            ////            for (int z = r; z < elements.Length; z++)
            ////            {
            ////                varFieldsValue = elements[z];
            ////                ProductRepository.AddProductsMetaVariation(Convert.ToInt64(PostIDs[x]), varFieldsName, varFieldsValue);
            ////                ProductRepository.UpdateProductsVariation(model.post_title + "-" + varFieldsValue, attributeheader[y] + ": " + varFieldsValue, Convert.ToInt64(PostIDs[x]));
            ////                break;
            ////            }

            ////        }
            ////    }

            ////    for (int x = 0; x < PostIDs.Length; x++)
            ////    {
            ////        for (int y = x; y < regularpriceval.Length; y++)
            ////        {

            ////            varFieldsName = "_regular_price";
            ////            varFieldsValue = regularpriceval[y];
            ////            ProductRepository.AddProductsMetaVariation(Convert.ToInt64(PostIDs[x]), varFieldsName, varFieldsValue);
            ////            ProductRepository.AddProductsMetaVariation(Convert.ToInt64(PostIDs[x]), "total_sales", "0");
            ////            ProductRepository.AddProductsMetaVariation(Convert.ToInt64(PostIDs[x]), "_download_expiry", "-1");
            ////            break;
            ////        }
            ////        for (int z = x; z < Salepricl.Length; z++)
            ////        {
            ////            varFieldsName = "_sale_price";
            ////            varFieldsValue = Salepricl[z];
            ////            ProductRepository.AddProductsMetaVariation(Convert.ToInt64(PostIDs[x]), varFieldsName, varFieldsValue);
            ////            ProductRepository.AddProductsMetaVariation(Convert.ToInt64(PostIDs[x]), "_price", varFieldsValue);
            ////            ProductRepository.AddProductsMetaVariation(Convert.ToInt64(model.post_parent), "_price", varFieldsValue);
            ////            ProductRepository.AddProductsMetaVariation(Convert.ToInt64(PostIDs[x]), "_download_limit", "no");
            ////            break;
            ////        }
            ////        for (int w = x; w < skuval.Length; w++)
            ////        {
            ////            varFieldsName = "_sku";
            ////            varFieldsValue = skuval[w];
            ////            ProductRepository.AddProductsMetaVariation(Convert.ToInt64(PostIDs[x]), varFieldsName, varFieldsValue);
            ////            //ProductRepository.AddProductsMetaVariation(Convert.ToInt64(PostIDs[x]), varFieldsName, varFieldsValue); model.post_parent
            ////            ProductRepository.AddProductsMetaVariation(Convert.ToInt64(PostIDs[x]), "_downloadable", "no");
            ////            break;
            ////        }
            ////    }

            ////    for (int x = 0; x < PostIDs.Length; x++)
            ////    {
            ////        for (int y = x; y < weightvariation.Length; y++)
            ////        {

            ////            varFieldsName = "_weight";
            ////            varFieldsValue = weightvariation[y];
            ////            ProductRepository.AddProductsMetaVariation(Convert.ToInt64(PostIDs[x]), varFieldsName, varFieldsValue);
            ////            ProductRepository.AddProductsMetaVariation(Convert.ToInt64(PostIDs[x]), "_sold_individually", "no");
            ////            break;
            ////        }
            ////        for (int z = x; z < Lvariation.Length; z++)
            ////        {
            ////            varFieldsName = "_length";
            ////            varFieldsValue = Lvariation[z];
            ////            ProductRepository.AddProductsMetaVariation(Convert.ToInt64(PostIDs[x]), varFieldsName, varFieldsValue);
            ////            ProductRepository.AddProductsMetaVariation(Convert.ToInt64(PostIDs[x]), "_tax_status", "taxable");
            ////            break;
            ////        }
            ////        for (int w = x; w < Wvariation.Length; w++)
            ////        {
            ////            varFieldsName = "_width";
            ////            varFieldsValue = Wvariation[w];
            ////            ProductRepository.AddProductsMetaVariation(Convert.ToInt64(PostIDs[x]), varFieldsName, varFieldsValue);
            ////            ProductRepository.AddProductsMetaVariation(Convert.ToInt64(PostIDs[x]), "_wc_review_count", "0");
            ////            break;
            ////        }
            ////        for (int u = x; u < Hvariation.Length; u++)
            ////        {
            ////            varFieldsName = "_height";
            ////            varFieldsValue = Hvariation[u];
            ////            ProductRepository.AddProductsMetaVariation(Convert.ToInt64(PostIDs[x]), varFieldsName, varFieldsValue);
            ////            ProductRepository.AddProductsMetaVariation(Convert.ToInt64(PostIDs[x]), "_wc_average_rating", "0");
            ////            ProductRepository.AddProductsMetaVariation(Convert.ToInt64(PostIDs[x]), "_stock_status", "instock");
            ////            break;
            ////        }

            ////    }

            ////    for (int x = 0; x < PostIDs.Length; x++)
            ////    {

            ////        for (int y = x; y < cassvariation.Length; y++)
            ////        {

            ////            varFieldsName = "_tax_class";
            ////            varFieldsValue = cassvariation[y];
            ////            ProductRepository.AddProductsMetaVariation(Convert.ToInt64(PostIDs[x]), varFieldsName, varFieldsValue);
            ////            break;
            ////        }
            ////        for (int z = x; z < allowbackordersvariation.Length; z++)
            ////        {
            ////            varFieldsName = "_backorders";
            ////            varFieldsValue = allowbackordersvariation[z];
            ////            ProductRepository.AddProductsMetaVariation(Convert.ToInt64(PostIDs[x]), varFieldsName, varFieldsValue);

            ////            break;
            ////        }
            ////        for (int w = x; w < Stockquantityvariation.Length; w++)
            ////        {
            ////            varFieldsName = "_stock";
            ////            varFieldsValue = Stockquantityvariation[w];
            ////            ProductRepository.AddProductsMetaVariation(Convert.ToInt64(PostIDs[x]), varFieldsName, varFieldsValue);

            ////            break;
            ////        }
            ////        for (int v = x; v < descriptionvariation.Length; v++)
            ////        {
            ////            varFieldsName = "_variation_description";
            ////            varFieldsValue = descriptionvariation[v];
            ////            ProductRepository.AddProductsMetaVariation(Convert.ToInt64(PostIDs[x]), varFieldsName, varFieldsValue);

            ////            break;
            ////        }

            ////        for (int u = x; u < shipvariation.Length; u++)
            ////        {
            ////            ProductRepository.Add_term(Convert.ToInt32(shipvariation[u]), Convert.ToInt32(PostIDs[x]));
            ////            break;
            ////        }


            ////    }
            ////    return Json(new { status = true, message = "Product Variations has been saved successfully!!", ID = 1 }, 0);
            ////}
        }

        //public JsonResult ProductImages(ProductCategoryModel model, HttpPostedFileBase ImageFile, string ID)
        //{
        //    var ImagePath = "";
        //    string FileName = "";
        //    string FileExtension = "";
        //    if (ImageFile != null)
        //    {
        //        FileName = Path.GetFileNameWithoutExtension(ImageFile.FileName);
        //        FileName = Regex.Replace(FileName, @"\s+", "");
        //        string size = (ImageFile.ContentLength / 1024).ToString();
        //        FileExtension = Path.GetExtension(ImageFile.FileName);
        //        if (FileExtension == ".png" || FileExtension == ".jpg" || FileExtension == ".jpeg" || FileExtension == ".bmp")
        //        {
        //            FileName = DateTime.Now.ToString("MMddyyhhmmss") + "-" + FileName.Trim() + FileExtension;

        //            string UploadPath = Path.Combine(Server.MapPath("~/Content/Product"));
        //            UploadPath = UploadPath + "\\";
        //            model.ImagePath = UploadPath + FileName;
        //            if (FileName == "")
        //            {
        //                FileName = "default.png";
        //            }
        //            ImagePath = "~/Content/Product/" + FileName;
        //            ImageFile.SaveAs(model.ImagePath);

        //            if (Convert.ToInt32(ID) > 0)
        //            {
        //                ProductRepository.EditProductImage(FileName, Convert.ToInt32(ID));
        //                return Json(new { status = true, message = "Product Image has been uploaded successfully!!", url = "", id = model.term_id }, 0);
        //            }
        //            else
        //                return Json(new { status = true, message = "Invalid Details!!", url = "", id = model.term_id }, 0);

        //        }
        //        else
        //        {
        //            return Json(new { status = false, message = "File Formate " + FileExtension + " is not allowed!!", url = "" }, 0);

        //        }

        //    }
        //    else
        //        return Json(new { status = false, message = "Please Upload File", url = "" }, 0);





        //}

        //public JsonResult ProductImages(ProductCategoryModel model, HttpPostedFileBase ImageFile, string ID)
        //{
        //    var ImagePath = "";
        //    string FileName = "";
        //    string FileExtension = "";
        //    if (ImageFile != null)
        //    {
        //        FileName = Path.GetFileNameWithoutExtension(ImageFile.FileName);
        //        FileName = Regex.Replace(FileName, @"\s+", "");
        //        string size = (ImageFile.ContentLength / 1024).ToString();
        //        FileExtension = Path.GetExtension(ImageFile.FileName);
        //        if (FileExtension == ".png" || FileExtension == ".jpg" || FileExtension == ".jpeg" || FileExtension == ".bmp")
        //        {
        //            FileName = DateTime.Now.ToString("MMddyyhhmmss") + "-" + FileName.Trim() + FileExtension;

        //            string UploadPath = Path.Combine(Server.MapPath("~/Content/Product"));
        //            UploadPath = UploadPath + "\\";
        //            model.ImagePath = UploadPath + FileName;
        //            if (FileName == "")
        //            {
        //                FileName = "default.png";
        //            }
        //            ImagePath = "~/Content/Product/" + FileName;
        //            ImageFile.SaveAs(model.ImagePath);

        //            if (Convert.ToInt32(ID) > 0)
        //            {
        //                DataTable dt = ProductRepository.GetImage_Details(Convert.ToInt32(ID));
        //                if (dt.Rows.Count > 0)
        //                    ProductRepository.updatethumbnailsImage(FileName, Convert.ToInt32(ID));
        //                else
        //                    ProductRepository.thumbnailsImage(FileName, Convert.ToInt32(ID));
        //                return Json(new { status = true, message = "Product Image has been uploaded successfully!!", url = "", id = model.term_id }, 0);
        //            }
        //            else
        //                return Json(new { status = true, message = "Invalid Details!!", url = "", id = model.term_id }, 0);

        //        }
        //        else
        //        {
        //            return Json(new { status = false, message = "File Formate " + FileExtension + " is not allowed!!", url = "" }, 0);

        //        }

        //    }
        //    else
        //        return Json(new { status = false, message = "Please Upload File", url = "" }, 0);





        //}
        public JsonResult ProductImages(ProductCategoryModel model, HttpPostedFileBase ImageFile, string ID)
        {
            var ImagePath = "";
            var ImagePaththum = "";
            string FileName = "";
            string FileNamethumb = "";
            string FileExtension = "";
            if (ImageFile != null)
            {
                FileName = Path.GetFileNameWithoutExtension(ImageFile.FileName);
                FileName = Regex.Replace(FileName, @"\s+", "");
                string size = (ImageFile.ContentLength / 1024).ToString();
                FileExtension = Path.GetExtension(ImageFile.FileName);
                // if (FileExtension == ".png" || FileExtension == ".jpg" || FileExtension == ".jpeg" || FileExtension == ".bmp")
                if (FileExtension == ".png" || FileExtension == ".PNG" || FileExtension == ".JPG" || FileExtension == ".jpg" || FileExtension == ".jpeg" || FileExtension == ".JPEG" || FileExtension == ".bmp" || FileExtension == ".BMP")
                {
                    FileNamethumb = DateTime.Now.ToString("MMddyyhhmmss") + "-" + FileName.Trim() + "_thumb" + FileExtension;
                    FileName = DateTime.Now.ToString("MMddyyhhmmss") + "-" + FileName.Trim() + FileExtension;

                    string UploadPath = Path.Combine(Server.MapPath("~/Content/Product"));
                    UploadPath = UploadPath + "\\";
                    model.ImagePath = UploadPath + FileName;
                    model.ImagePathOut = UploadPath + FileNamethumb;
                    if (FileName == "")
                    {
                        FileName = "default.png";
                    }
                    ImagePath = "~/Content/Product/" + FileName;
                    ImagePaththum = "~/Content/Product/" + FileNamethumb;
                    ImageFile.SaveAs(model.ImagePath);

                    Image image = Image.FromFile(model.ImagePath);
                    Size thumbnailSize = GetThumbnailSize(image);

                    // Get thumbnail.
                    Image thumbnail = image.GetThumbnailImage(thumbnailSize.Width,
                        thumbnailSize.Height, null, IntPtr.Zero);

                    // Save thumbnail.
                    thumbnail.Save(model.ImagePathOut);

                    if (Convert.ToInt32(ID) > 0)
                    {
                        DataTable dt = ProductRepository.GetImage_Details(Convert.ToInt32(ID));
                        if (dt.Rows.Count > 0)
                            ProductRepository.UpdateBothImage(FileNamethumb, FileName, Convert.ToInt32(ID));
                        else
                            ProductRepository.PopupBothImage(FileNamethumb, FileName, Convert.ToInt32(ID));
                        return Json(new { status = true, message = "Product image uploaded successfully!!", url = "", id = model.term_id }, 0);
                    }
                    else
                        return Json(new { status = true, message = "Invalid details!!", url = "", id = model.term_id }, 0);

                }
                else
                {
                    return Json(new { status = false, message = "File formate " + FileExtension + " is not allowed!!", url = "" }, 0);

                }

            }
            else
                return Json(new { status = false, message = "Please upload file", url = "" }, 0);

        }


        static Size GetThumbnailSize(Image original)
        {
            // Maximum size of any dimension.
            const int maxPixels = 600;

            // Width and height.        
            int originalWidth = original.Width;
            int originalHeight = original.Height;

            // Compute best factor to scale entire image based on larger dimension.
            double factor;
            if (originalWidth > originalHeight)
            {
                factor = (double)maxPixels / originalWidth;
            }
            else
            {
                factor = (double)maxPixels / originalHeight;
            }

            // Return thumbnail size.
            // return new Size((int)(originalWidth * factor), (int)(originalHeight));
            return new Size((int)(originalWidth * factor), (int)(originalHeight * factor));
        }

        public JsonResult SaveChildvariations(ProductModel model)
        {

            string result = string.Empty;
            bool status = false;
            try
            {
                int res = ProductRepository.Childvariations(model.ProductChildMeta);
                if (res > 0)
                {
                    status = true;
                }
            }
            catch { status = false; result = ""; }
            return Json(new { status = true, message = "Update successfully!!", ID = 1 }, 0);
        }
        public JsonResult SaveComponentChildvariations(ProductModel model)
        {

            string result = string.Empty;
            bool status = false;
            try
            {
                int res = ProductRepository.SaveComponentChildvariations(model.ProductChildMeta);
                if (res > 0)
                {
                    status = true;
                }
            }
            catch { status = false; result = ""; }
            return Json(new { status = true, message = "Update successfully!!", ID = 1 }, 0);
        }
        public JsonResult UpdateChildvariations(ProductModel model)
        {

            string result = string.Empty;
            bool status = false;
            try
            {
                int res = ProductRepository.UpdateChildvariations(model.ProductChildMeta);
                if (res > 0)
                {
                    status = true;
                }
            }
            catch { status = false; result = ""; }
            return Json(new { status = true, message = "Update successfully!!", ID = 1 }, 0);
        }

        [HttpPost]
        public JsonResult GetNotesList(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                long oid = 0;
                string type = CommanUtilities.Provider.GetCurrent().UserType;
                if (!string.IsNullOrEmpty(model.strValue1)) { oid = Convert.ToInt64(model.strValue1); }
                if (oid <= 0)
                {
                    throw new Exception("Invalid Data");
                }
                DataTable DT = ProductRepository.GetNotes(oid, type);
                JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        [HttpPost]
        public JsonResult NoteAdd(OrderNotesModel model)
        {
            string JSONresult = string.Empty; bool b_status = false;
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                model.comment_author = om.UserName; model.comment_author_email = om.EmailID;
                int res = ProductRepository.AddNotes(model);
                if (res > 0)
                {
                    JSONresult = "Product note added successfully."; b_status = true;
                }
            }
            catch (Exception ex) { JSONresult = ex.Message; }
            return Json(new { status = b_status, message = JSONresult }, 0);
        }
        [HttpPost]
        public JsonResult NoteDelete(OrderNotesModel model)
        {
            string JSONresult = string.Empty; bool b_status = false;
            try
            {
                int res = ProductRepository.RemoveNotes(model);
                if (res > 0)
                {
                    JSONresult = "Product note deleted successfully."; b_status = true;
                }
            }
            catch (Exception ex) { JSONresult = ex.Message; }
            return Json(new { status = b_status, message = JSONresult }, 0);
        }
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Product Categories~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        public JsonResult GetParentCategory(string id)
        {
            DataTable ds = BAL.ProductRepository.GetParentCategory(id);
            string JSONresult = JsonConvert.SerializeObject(ds);
            return Json(JSONresult, 0);
        }
        public JsonResult AddProductCategory(ProductCategoryModel model, HttpPostedFileBase ImageFile, string name, string slug, string parent, string ParentText, string description)
        {
            var ImagePath = "";
            string FileName = "";
            string FileExtension = "";
            string checkname = new ProductRepository().GetName(name);
            string checknameonEdit = new ProductRepository().GetNameonEdit(name, model.term_id);
            if (ParentText.ToLower() == name.ToLower())
            {
                return Json(new { status = false, message = "Parent and category can not be same. Please select another parent category.", url = "", id = 0 }, 0);
            }
            if (model.term_id == 0 && checkname.ToLower() == name.ToLower())
            {
                return Json(new { status = false, message = "Category already exists", url = "", id = 0 }, 0);
            }
            //else if (model.term_id > 0 && checknameonEdit.ToLower() == name.ToLower())
            //{
            //    return Json(new { status = false, message = "Category already exists", url = "", id = 0 }, 0);
            //}
            else
            {
                if (ImageFile != null)
                {
                    FileName = Path.GetFileNameWithoutExtension(ImageFile.FileName);
                    FileName = Regex.Replace(FileName, @"\s+", "");
                    string size = (ImageFile.ContentLength / 1024).ToString();
                    FileExtension = Path.GetExtension(ImageFile.FileName);
                    if (FileExtension == ".png" || FileExtension == ".PNG" || FileExtension == ".JPG" || FileExtension == ".jpg" || FileExtension == ".jpeg" || FileExtension == ".JPEG" || FileExtension == ".bmp" || FileExtension == ".BMP")
                    {
                        FileName = DateTime.Now.ToString("MMddyyhhmmss") + "-" + FileName.Trim() + FileExtension;

                        string UploadPath = Path.Combine(Server.MapPath("~/Content/ProductCategory"));
                        UploadPath = UploadPath + "\\";
                        model.ImagePath = UploadPath + FileName;
                        if (FileName == "")
                        {
                            FileName = "default.png";
                        }
                        ImagePath = "~/Content/ProductCategory/" + FileName;
                        ImageFile.SaveAs(model.ImagePath);
                    }
                    else
                    {
                        return Json(new { status = false, message = "File formate " + FileExtension + " is not allowed!!", url = "" }, 0);

                    }
                }

                if (model.term_id > 0)
                {
                    long thumbnailID = 0;
                    if (model.Meta_id > 0 && ImagePath == "")
                    {
                        FileName = new ProductRepository().GetFileName(model.Meta_id);

                        ImagePath = "~/Content/ProductCategory/" + FileName;
                    }
                    if (model.Meta_id > 0)
                    {
                        thumbnailID = model.Meta_id;
                        ProductRepository.EditImage(FileName, ImagePath, FileExtension, thumbnailID);
                    }
                    else
                    {
                        thumbnailID = ProductRepository.AddImage(FileName, ImagePath, FileExtension);
                    }
                    UserActivityLog.WriteDbLog(LogType.Submit, "Update product category (" + name + ")", "/Product/ProductCategories" + ", " + Net.BrowserInfo);

                    ProductRepository.EditPostMeta(thumbnailID, ImagePath, FileName);
                    new ProductRepository().EditProductCategory(model, name, slug, parent, description, thumbnailID);
                    return Json(new { status = true, message = "Product category updated successfully!!", url = "", id = model.term_id }, 0);
                }
                else
                {

                    int ID = new ProductRepository().AddProductCategory(model, name, slug);
                    if (ID > 0)
                    {
                        UserActivityLog.WriteDbLog(LogType.Submit, "Add new product category (" + name + ")", "/Product/ProductCategories" + ", " + Net.BrowserInfo);
                        int thumbnailID = ProductRepository.AddImage(FileName, ImagePath, FileExtension);
                        ProductRepository.postmeta(thumbnailID, ImagePath);
                        new ProductRepository().AddProductCategoryDesc(model, ID, thumbnailID);
                        return Json(new { status = true, message = "Product category saved successfully!!", url = "" }, 0);
                    }
                    else
                    {
                        return Json(new { status = false, message = "Invalid details", url = "", id = 0 }, 0);
                    }
                }
            }

        }
        public JsonResult ProductCategoryList(ProductCategoryModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                long id = model.term_id;
                string urid = "";
                if (model.user_status != "")
                    urid = model.user_status;
                string searchid = model.Search;
                DataTable dt = ProductRepository.ProductCategoryList(id, urid, searchid, model.PageNo, model.PageSize, out TotalRecord, model.SortCol, model.SortDir);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }
        public JsonResult DeleteCategorywithProduct(ProductCategoryModel model)
        {
            string termID = model.strVal;
            if (termID != "")
            {
                int ProductID = new ProductRepository().DeleteProductfromCategory(termID);
                int ID = new ProductRepository().DeleteProductCategory(termID);
                if (ID > 0)
                {

                    return Json(new { status = true, message = "Product category deleted successfully!!", url = "", id = ID }, 0);
                }
                else
                    return Json(new { status = false, message = "Invalid details", url = "", id = 0 }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Product category not Found", url = "", id = 0 }, 0);
            }
        }
        public JsonResult DeleteProductCategory(ProductCategoryModel model)
        {
            string termID = model.strVal;
            if (termID != "")
            {
                int ID = new ProductRepository().DeleteProductCategory(termID);
                if (ID > 0)
                {
                    return Json(new { status = true, message = "Product category deleted successfully!!", url = "", id = ID }, 0);
                }
                else
                    return Json(new { status = false, message = "Invalid details", url = "", id = 0 }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Product category not Found", url = "", id = 0 }, 0);
            }
        }
        public JsonResult GetCategoryByID(long id)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = ProductRepository.GetCategoryByID(id);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        [HttpGet]
        public JsonResult Getpricedetails(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                long id = 0; long viid = 0;
                if (!string.IsNullOrEmpty(model.strValue1))
                    id = Convert.ToInt64(model.strValue1);
                if (!string.IsNullOrEmpty(model.strValue2))
                    viid = Convert.ToInt64(model.strValue2);
                DataSet ds = ProductRepository.Getpricedetails(id, viid);
                JSONresult = JsonConvert.SerializeObject(ds);
            }
            catch { }
            return Json(new { data = JSONresult }, 0);
        }

        [HttpGet]
        public JsonResult GetProductOpeningStock(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {

                DataTable dt = ProductRepository.GetProductOpeningStock(model.strValue1, model.strValue2, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);

            }
            catch { }
            //return Json(result, 0); ProductOpendingStock
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, aaData = result }, 0);
        }

        public JsonResult AddOpeningStock(ProductOpendingStock model)
        {
            UserActivityLog.WriteDbLog(LogType.Submit, "Add Product Opening Stock", "/Product/AddProductOpeningStock" + ", " + Net.BrowserInfo);
            //DataTable dt1 = SetupRepostiory.CountRuleForState(model);
            //if (dt1.Rows.Count > 0)
            //{
            //    return Json(new { status = false, message = "Product rule already exists for these states", url = "" }, 0);
            //}
            //else
            //{
            int ID = ProductRepository.AddProductOpeningStock(model);
            if (ID > 0)
            {
                if (ID == 111111111)
                    return Json(new { status = true, message = "Product Opening Stock saved successfully!!", url = "Manage" }, 0);
                else
                    return Json(new { status = true, message = "Product Opening Stock saved successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }
            //}
        }

        public JsonResult GetProductCount(SetupModel model)
        {
            int ID = ProductRepository.GetProductCount(model);
            if (ID > 0)
            {

                return Json(new { status = true, message = "Product already exists", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }
        }

        public JsonResult GetOpeningById(string strValue1)
        {
            string JSONResult = string.Empty;
            DataTable dt = new DataTable();
            try
            {
                dt = ProductRepository.GetOpeningById(strValue1);
                JSONResult = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Json(JSONResult, 0);
        }

        public JsonResult UpdatecomponentStatus(AccountingJournalModel model)
        {
            if (model.rowid > 0)
            {
                new ProductRepository().UpdatecomponentStatus(model);
                return Json(new { status = true, message = "Status changed successfully!!", url = "", id = model.rowid }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Something went wrong!!", url = "", id = 0 }, 0);
            }
        }
        public JsonResult GetComponentProductParent(SearchModel model)
        {
            List<ProductModelservices> obj = new List<ProductModelservices>();
            try
            {
                obj = ProductRepository.GetComponentProductParent(model.strValue1, model.strValue2);
            }
            catch { }
            return Json(obj, 0);
        }

        public JsonResult UpdateComponentChildvariations(ProductModel model)
        {

            string result = string.Empty;
            bool status = false;
            try
            {
                int res = ProductRepository.UpdateComponentChildvariations(model.ProductChildMeta);
                if (res > 0)
                {
                    status = true;
                }
            }
            catch { status = false; result = ""; }
            return Json(new { status = true, message = "Update successfully!!", ID = 1 }, 0);
        }

        public JsonResult UpdateproductcomponentStatus(AccountingJournalModel model)
        {
            if (model.rowid > 0)
            {
                new ProductRepository().UpdateproductcomponentStatus(model);
                return Json(new { status = true, message = "Component status changed successfully!!", url = "", id = model.rowid }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Something went wrong!!", url = "", id = 0 }, 0);
            }
        }

        public JsonResult Getproducttype()
        {
            string JSONString = string.Empty;
            DataTable dt = new DataTable();
            dt = BAL.ProductRepository.Getproducttype();
            JSONString = JsonConvert.SerializeObject(dt);
            return Json(JSONString, JsonRequestBehavior.AllowGet);
        }

        //public JsonResult GetpageData(SearchModel model)
        //{
        //    string JSONresult = string.Empty;
        //    try
        //    {
        //        DataTable DT = CMSRepository.GetpageData(model.strValue1);
        //        JSONresult = JsonConvert.SerializeObject(DT);
        //    }
        //    catch { }
        //    return Json(JSONresult, 0);
        //}

        [HttpGet]
        public JsonResult GetProductList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = ProductRepository.GetProductList(model.strValue1, model.strValue2, model.strValue3, model.strValue4, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, aaData = result }, 0);
        }

        [HttpGet]
        public JsonResult Categories(long id = 0)
        {
            List<Dictionary<String, Object>> tableRows = new List<Dictionary<String, Object>>();
            Dictionary<String, Object> row;
            try
            {
                DataTable DT = BAL.ProductRepository.GetProductCategory("productcategory", 1, id);
                DataRow[] rows = DT.Select("[parent] = 0", "term_order");
                foreach (DataRow dr in rows)
                {
                    row = new Dictionary<String, Object>();
                    row.Add("term_id", dr["term_id"]);
                    row.Add("id", dr["term_taxonomy_id"]);
                    row.Add("text", dr["name"]);
                    if (dr["parent"] != DBNull.Value) row.Add("parent", dr["parent"]);
                    if (dr["object_id"] != DBNull.Value) row.Add("checked", true);
                    row.Add("term_order", dr["term_order"]);
                    List<Dictionary<string, object>> list2 = Getdata(DT, Convert.ToInt32(dr["term_id"]));
                    row.Add("children", list2);
                    tableRows.Add(row);
                }
            }
            catch (Exception ex) { throw ex; }
            return Json(tableRows, 0);
        }

        public static List<Dictionary<string, object>> Getdata(DataTable DT, int ParentID)
        {
            List<Dictionary<string, object>> list = new List<Dictionary<string, object>>();
            Dictionary<String, Object> row;
            DataRow[] rows = DT.Select("[parent] = " + ParentID.ToString(), "term_order");
            foreach (DataRow dr in rows)
            {
                row = new Dictionary<String, Object>();
                row.Add("term_id", dr["term_id"]);
                row.Add("id", dr["term_taxonomy_id"]);
                row.Add("text", dr["name"]);
                if (dr["parent"] != DBNull.Value) row.Add("parent", dr["parent"]);
                if (dr["object_id"] != DBNull.Value) row.Add("checked", true);
                row.Add("term_order", dr["term_order"]);
                List<Dictionary<string, object>> list2 = Getdata(DT, Convert.ToInt32(dr["term_id"]));
                row.Add("children", list2);
                list.Add(row);
            }
            return list;
        }

        [HttpGet]
        public JsonResult GetTaxonomyTerms(string taxonomy = "-", string query = "-")
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable DT = BAL.ProductRepository.GetTaxonomyTerms(taxonomy, query);
                JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public JsonResult AttributesList(ProductCategoryModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                long id = model.term_id;
                string urid = "";
                if (model.user_status != "")
                    urid = model.user_status;
                string searchid = model.Search;
                DataTable dt = ProductRepository.AttributesList(id, urid, searchid, model.PageNo, model.PageSize, out TotalRecord, model.SortCol, model.SortDir);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }

        public JsonResult GetAttributesByID(long id)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = ProductRepository.GetAttributesByID(id);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        public JsonResult AddProductAttributes(string term_id, string name, string slug, string _type, string _orderby, string _publish, string old_slug)
        {
            string sql = string.Empty;
            if (Convert.ToInt32(term_id) > 0)
            {
                int _c = Convert.ToInt32(SQLHelper.ExecuteScalar(string.Format("SELECT COUNT(attribute_id) c FROM wp_woocommerce_attribute_taxonomies WHERE LOWER(attribute_label) = RTRIM(LOWER('{0}')) AND attribute_id != {1}", name, term_id)).ToString());
                if (_c <= 0)
                {
                    _c = Convert.ToInt32(SQLHelper.ExecuteScalar(string.Format("SELECT COUNT(attribute_id) c FROM wp_woocommerce_attribute_taxonomies WHERE LOWER(attribute_name) = RTRIM(LOWER('{0}')) AND attribute_id != {1}", slug, term_id)).ToString());
                    if (_c <= 0)
                    {
                        sql = $"UPDATE wp_term_taxonomy SET taxonomy='pa_{slug}' WHERE taxonomy in (SELECT CONCAT('pa_',attribute_name) FROM wp_woocommerce_attribute_taxonomies WHERE attribute_id = {term_id}); update wp_woocommerce_attribute_taxonomies set attribute_name = '{slug}',attribute_label = '{name}',attribute_type = '{_type}',attribute_orderby = '{_orderby}',attribute_public = {_publish} WHERE attribute_id = {term_id};";
                        sql += UpdateAttributeName($"pa_{old_slug}", $"pa_{slug}");
                        if (SQLHelper.ExecuteNonQueryWithTrans(sql.ToString()) > 0)
                        {
                            //Update_wp_options();
                            return Json(new { status = true, message = "Product Attributes updated successfully!!", url = "", id = term_id }, 0);
                        }
                        else
                        {
                            return Json(new { status = false, message = String.Format("Slug \"{0}\" is already in use. Change it, please.", slug), url = "", id = 0 }, 0);

                        }
                    }
                    else
                    {
                        return Json(new { status = false, message = String.Format("Slug \"{0}\" is already in use. Change it, please.", slug), url = "", id = 0 }, 0);

                    }
                }
                else
                {
                    return Json(new { status = false, message = String.Format("Name \"{0}\" is already in use. Change it, please.", name), url = "", id = 0 }, 0);

                }
            }
            else
            {
                int _c = Convert.ToInt32(SQLHelper.ExecuteScalar(string.Format("SELECT COUNT(attribute_id) c FROM wp_woocommerce_attribute_taxonomies WHERE LOWER(attribute_label) = RTRIM(LOWER('{0}')) AND attribute_id != {1}", name, term_id)).ToString());
                if (_c <= 0)
                {
                    _c = Convert.ToInt32(SQLHelper.ExecuteScalar(string.Format("SELECT COUNT(attribute_id) c FROM wp_woocommerce_attribute_taxonomies WHERE LOWER(attribute_name) = RTRIM(LOWER('{0}')) AND attribute_id != {1}", slug, term_id)).ToString());
                    if (_c <= 0)
                    {
                        sql = $"insert into wp_woocommerce_attribute_taxonomies(attribute_name,attribute_label,attribute_type,attribute_orderby,attribute_public) values('{slug}','{name}','{_type}','{_orderby}',{_publish});";
                        if (SQLHelper.ExecuteNonQuery(sql.ToString()) > 0)
                        {
                            // Update_wp_options();
                            return Json(new { status = true, message = "Product Attributes saved successfully!!", url = "" }, 0);
                        }
                        else
                        {
                            return Json(new { status = false, message = String.Format("Slug \"{0}\" is already in use. Change it, please.", slug), url = "", id = 0 }, 0);
                        }
                    }
                    else
                    {

                        return Json(new { status = false, message = String.Format("Slug \"{0}\" is already in use. Change it, please.", slug), url = "", id = 0 }, 0);

                    }
                }
                else
                {
                    return Json(new { status = false, message = String.Format("Name \"{0}\" is already in use. Change it, please.", name), url = "", id = 0 }, 0);
                }
            }
        }

        public static int Update_wp_options()
        {
            int i = 0;
            try
            {
                //string sql = "INSERT INTO wp_options (option_name,option_value,autoload) SELECT * FROM "
                //            + " (SELECT '_transient_wc_attribute_taxonomies' AS New_Option_Name, CONCAT('a:', COUNT(*), ':{', GROUP_CONCAT(option_value SEPARATOR ''), '}') AS New_Option_Value, 'yes' AS New_Autoload"
                //            + " FROM"
                //            + " (SELECT CONCAT("
                //            + " 'i:', (ROW_NUMBER() OVER(ORDER BY attribute_name)) - 1, ';O:8:', '\"', 'stdclass', '\"', ':6:'"
                //            + " , '{S:12:', '\"', 'attribute_id', '\"', ';s:', LENGTH(attribute_id), ':', '\"', attribute_id, '\"', ';'"
                //            + " , 'S:14:', '\"', 'attribute_name', '\"', ';s:', LENGTH(attribute_name), ':', '\"', attribute_name, '\"', ';'"
                //            + " , 'S:15:', '\"', 'attribute_label', '\"', ';s:', LENGTH(attribute_label), ':', '\"', attribute_label, '\"', ';'"
                //            + " , 'S:14:', '\"', 'attribute_type', '\"', ';s:', LENGTH(attribute_type), ':', '\"', attribute_type, '\"', ';'"
                //            + " , 'S:17:', '\"', 'attribute_orderby', '\"', ';s:', LENGTH(attribute_orderby), ':', '\"', attribute_orderby, '\"', ';'"
                //            + " , 'S:16:', '\"', 'attribute_public', '\"', ';s:', LENGTH(attribute_public), ':', '\"', attribute_public, '\"', ';}'"
                //            + " ) AS option_value FROM wp_woocommerce_attribute_taxonomies ORDER BY attribute_name) Calculated_values"
                //            + " ) Formatted_Values"
                //            + " ON DUPLICATE KEY UPDATE option_value = Formatted_Values.New_Option_Value; ";


                i = SQLHelper.ExecuteNonQueryWithTrans("bulk_editor_attribute_options");
            }
            catch { }
            return i;
        }
        public static string UpdateAttributeName(string _old_taxonomy, string _taxonomy)
        {
            StringBuilder builder = new StringBuilder();
            try
            {
                string sql = $"SELECT object_id,pm.meta_value FROM wp_term_taxonomy tt INNER JOIN wp_term_relationships tr ON tr.term_taxonomy_id = tt.term_taxonomy_id INNER JOIN wp_postmeta pm ON pm.post_id = tr.object_id AND pm.meta_key = '_product_attributes' WHERE tt.taxonomy = '{_old_taxonomy}'";
                DataTable dt = SQLHelper.ExecuteDataTable(sql);
                foreach (DataRow item in dt.Rows)
                {
                    if (!string.IsNullOrEmpty(item["meta_value"].ToString()))
                    {
                        string s = get_product_attributes(item["meta_value"].ToString(), _old_taxonomy, _taxonomy, false);
                        builder.Append(String.Format("update wp_postmeta set meta_value = '{0}' where post_id = {1} and meta_key = '_product_attributes';", s, item["object_id"].ToString()));
                    }
                }
            }
            catch { }
            return builder.ToString();
        }
        private static string get_product_attributes(string _product_attributes, string old_attributes, string new_attributes, bool is_remove)
        {
            string _new_product_attributes = string.Empty;
            try
            {
                System.Collections.Hashtable _obj = new Serializer().Deserialize(_product_attributes) as System.Collections.Hashtable;
                System.Collections.Hashtable _att_value = (System.Collections.Hashtable)_obj[old_attributes];
                _att_value["name"] = new_attributes;
                _obj.Remove(old_attributes);
                _obj.Add(new_attributes, _att_value);

                _new_product_attributes = new Serializer().Serialize(_obj);
            }
            catch { }
            return _new_product_attributes;
        }

        public JsonResult DeleteAttributes(ProductCategoryModel model)
        {
            string termID = model.strVal;
            string sql = string.Empty;
            if (termID != "")
            {


                sql = string.Format("delete from wp_term_relationships WHERE term_taxonomy_id IN (SELECT term_taxonomy_id FROM wp_term_taxonomy WHERE taxonomy = (SELECT CONCAT('pa_',attribute_name) FROM wp_woocommerce_attribute_taxonomies WHERE attribute_id = {0}));", termID);
                sql += string.Format("delete from wp_terms WHERE term_id IN (SELECT term_id FROM wp_term_taxonomy WHERE taxonomy = (SELECT CONCAT('pa_',attribute_name) FROM wp_woocommerce_attribute_taxonomies WHERE attribute_id = {0}));", termID);
                sql += string.Format("delete from wp_term_taxonomy WHERE taxonomy = (SELECT CONCAT('pa_',attribute_name) FROM wp_woocommerce_attribute_taxonomies WHERE attribute_id = {0});", termID);
                sql += string.Format("delete from wp_woocommerce_attribute_taxonomies WHERE attribute_id = {0};", termID);
                if (SQLHelper.ExecuteNonQuery(sql.ToString()) > 0)
                {
                    return Json(new { status = true, message = "Attributes deleted successfully!!", url = "", id = termID }, 0);
                }
                else
                    return Json(new { status = false, message = "Invalid details", url = "", id = 0 }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Attributes not Found", url = "", id = 0 }, 0);
            }
        }

        public JsonResult EditAttributesList(ProductCategoryModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                string _taxonomy = "";
                long id = model.term_id;
                string urid = "";
                if (model.user_status != "")
                    urid = model.user_status;
                string searchid = model.Search;
                _taxonomy = $"pa_{ model.Search}";
                //DataTable dt = ProductRepository.AttributesList(id, urid, searchid, model.PageNo, model.PageSize, out TotalRecord, model.SortCol, model.SortDir);

                //string sql = "SELECT tt.taxonomy,tt.term_taxonomy_id,tt.term_id,tt.description,tt.parent,tt.count,t.name,t.slug,t.term_group,t.term_order FROM wp_term_taxonomy tt "
                //                + " INNER JOIN wp_terms t ON t.term_id = tt.term_id"
                //                + string.Format(" WHERE tt.term_id > 0 AND tt.taxonomy = '{0}' ORDER BY tt.taxonomy,t.name;", _taxonomy);

                //SqlParameter[] parameters = {  new SqlParameter("@Flag", "show"),
                //    new SqlParameter("@attribute_id", id)
                //    };

                DataTable dt = ProductRepository.GeteditAttributesByID("show", _taxonomy, 0);

                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }

        public JsonResult GeteditAttributesByID(string strValue1, string strValue2)
        {
            string JSONresult = string.Empty;
            try
            {
                string _taxonomy = "";
                long id = Convert.ToInt64(strValue1);
                _taxonomy = strValue2;
                //string sql = "SELECT tt.taxonomy,tt.term_taxonomy_id,tt.term_id,tt.description,tt.parent,tt.count,t.name,t.slug,t.term_group,t.term_order FROM wp_term_taxonomy tt "
                //               + " INNER JOIN wp_terms t ON t.term_id = tt.term_id"
                //               + string.Format(" WHERE tt.term_id > 0 AND tt.taxonomy = '{0}' ORDER BY tt.taxonomy,t.name;", _taxonomy);

                //SqlParameter[] parameters = { };
                //DataTable dt = DAL.SQLHelper.ExecuteDataTable(sql, parameters);
                DataTable dt = ProductRepository.GeteditAttributesByID("edit", _taxonomy, id);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }


        public JsonResult AddProducteditAttributes(string id, string _taxonomy, string _name, string _slug, string _desc)
        {
            _taxonomy = $"pa_{_taxonomy}";
            string sql = string.Empty;
            if (Convert.ToInt32(id) > 0)
            {
                int _c = Convert.ToInt32(SQLHelper.ExecuteScalar(string.Format("SELECT COUNT(tt.term_id) c FROM wp_term_taxonomy tt INNER JOIN wp_terms t ON t.term_id = tt.term_id WHERE tt.taxonomy = '{0}' AND LOWER(t.name) = RTRIM(LOWER('{1}')) AND tt.term_id != {2}", _taxonomy, _name, id)).ToString());
                if (_c <= 0)
                {
                    _c = Convert.ToInt32(SQLHelper.ExecuteScalar(string.Format("SELECT COUNT(tt.term_id) c FROM wp_term_taxonomy tt INNER JOIN wp_terms t ON t.term_id = tt.term_id WHERE tt.taxonomy = '{0}' AND LOWER(t.slug) = RTRIM(LOWER('{1}')) AND tt.term_id != {2}", _taxonomy, _slug, id)).ToString());
                    if (_c <= 0)
                    {
                        sql = string.Format("UPDATE wp_terms SET NAME = '{0}',slug = '{1}' WHERE term_id = {2};UPDATE wp_term_taxonomy SET description = '{3}' WHERE term_id = {2};", _name, _slug, id, _desc);
                        if (SQLHelper.ExecuteNonQueryWithTrans(sql.ToString()) > 0)
                        {
                            //Update_wp_options();
                            return Json(new { status = true, message = "Product Attributes updated successfully!!", url = "", id = id }, 0);
                        }
                        else
                        {
                            return Json(new { status = false, message = String.Format("Tag slug '\"{0}\" already exists.", _slug), url = "", id = 0 }, 0);

                        }
                    }
                    else
                    {
                        return Json(new { status = false, message = String.Format("Tag slug \"{0}\" is already in use. Change it, please.", _slug), url = "", id = 0 }, 0);

                    }
                }
                else
                {
                    return Json(new { status = false, message = String.Format("Tag Name \"{0}\" is already in use. Change it, please.", _name), url = "", id = 0 }, 0);

                }
            }
            else
            {
                int _c = Convert.ToInt32(SQLHelper.ExecuteScalar(string.Format("SELECT COUNT(tt.term_id) c FROM wp_term_taxonomy tt INNER JOIN wp_terms t ON t.term_id = tt.term_id WHERE tt.taxonomy = '{0}' AND LOWER(t.name) = RTRIM(LOWER('{1}'));", _taxonomy, _name)).ToString());
                if (_c <= 0)
                {
                    _c = Convert.ToInt32(SQLHelper.ExecuteScalar(string.Format("SELECT COUNT(tt.term_id) c FROM wp_term_taxonomy tt INNER JOIN wp_terms t ON t.term_id = tt.term_id WHERE tt.taxonomy = '{0}' AND LOWER(t.slug) = RTRIM(LOWER('{0}'));", _taxonomy, _slug)).ToString());
                    if (_c <= 0)
                    {
                        sql = "";
                        sql = string.Format("insert into wp_terms(name,slug,term_group,term_order) values('{0}','{1}',0,0);DECLARE @LastInsertedID INT;SET @LastInsertedID = SCOPE_IDENTITY();insert into wp_term_taxonomy(term_id,taxonomy,description,parent,count) SELECT @LastInsertedID,'{2}','{3}',0,0;", _name, _slug, _taxonomy, _desc);
                        if (SQLHelper.ExecuteNonQuery(sql.ToString()) > 0)
                        {
                            // Update_wp_options();
                            return Json(new { status = true, message = "Attributes saved successfully!!", url = "" }, 0);
                        }
                        else
                        {
                            return Json(new { status = false, message = String.Format("Tag Slug \"{0}\" is already in use. Change it, please.", _slug), url = "", id = 0 }, 0);
                        }
                    }
                    else
                    {

                        return Json(new { status = false, message = String.Format("Tag Slug \"{0}\" is already in use. Change it, please.", _slug), url = "", id = 0 }, 0);

                    }
                }
                else
                {
                    return Json(new { status = false, message = String.Format("Tag Name \"{0}\" is already in use. Change it, please.", _name), url = "", id = 0 }, 0);
                }
            }
        }


        public JsonResult DeleteeditAttributes(string strVal1, string strVal2)
        {
            string termID = strVal1;
            string sql = string.Empty;
            if (termID != "")
            {
                sql = string.Format("DELETE FROM wp_term_relationships WHERE term_taxonomy_id IN (SELECT term_taxonomy_id FROM wp_term_taxonomy WHERE term_id = {0});DELETE FROM wp_term_taxonomy WHERE term_id = {0};DELETE FROM wp_terms WHERE term_id = {0};", Convert.ToInt64(termID));
                if (SQLHelper.ExecuteNonQuery(sql.ToString()) > 0)
                {
                    return Json(new { status = true, message = "Attributes deleted successfully!!", url = "", id = termID }, 0);
                }
                else
                    return Json(new { status = false, message = "Invalid details", url = "", id = 0 }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Attributes not Found", url = "", id = 0 }, 0);
            }
        }

        [HttpGet]
        public JsonResult GetCategoryList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = ProductRepository.GetCategoryList(model.strValue1, model.strValue2, model.strValue3, model.strValue4, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, aaData = result }, 0);
        }

        public JsonResult GetParentCategorylist(string id)
        {
            DataTable ds = BAL.ProductRepository.GetParentCategorylist(id);
            string JSONresult = JsonConvert.SerializeObject(ds);
            return Json(JSONresult, 0);
        } 
        
        [HttpGet]
        public JsonResult GetProductMargin(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = ProductRepository.GetProductMargin(model.strValue1, model.strValue2, model.strValue3, model.strValue4, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, aaData = result }, 0);
        }

        public JsonResult Getvariationdetailsbyid(OrderPostStatusModel model)
        {
            string JSONresult = string.Empty;
            List<dynamic> mainRecords = new List<dynamic>();

            try
            {
                LaylaERP.UTILITIES.Serializer serializer = new LaylaERP.UTILITIES.Serializer();
                DataSet ds = ProductRepository.getvariationdetailsbyid(model);

                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    dynamic obj = new ExpandoObject();
                    obj.cast_prise = dr["cast_prise"];
                    obj.id = dr["id"];
                    obj.post_title = dr["post_title"];
                    obj.post_content = dr["post_content"];
                    obj.post_name = dr["post_name"];
                    obj.guid = dr["guid"];
                    obj.meta_data = dr["meta_data"];
                    obj.shippingclass = dr["shippingclass"];
                    obj.thumbnails = dr["thumbnails"];
                    obj.image = dr["image"];
                    obj.saleamount = dr["saleamount"];
                    obj.regularamount = dr["regularamount"];
                    obj.Margin = dr["Margin"];
                    obj.regularMargin = dr["regularMargin"];
                    obj.marginpersantage = dr["marginpersantage"];
                    obj.regularmarginpersantage = dr["regularmarginpersantage"];

                    List<dynamic> attributesList = new List<dynamic>();

                    foreach (DataRow dr_v in ds.Tables[1].Rows)
                    {
                        if (!string.IsNullOrEmpty(dr_v["attributes"].ToString()))
                        {
                            System.Collections.Hashtable _att = serializer.Deserialize(dr_v["attributes"].ToString()) as System.Collections.Hashtable;
                            foreach (System.Collections.DictionaryEntry att in _att)
                            {
                                System.Collections.Hashtable _att_value = (System.Collections.Hashtable)att.Value;
                                DataRow[] rows = ds.Tables[2].Select("attribute_name = '" + att.Key.ToString().Replace("pa_", "") + "'", "");
                                if (_att_value["is_taxonomy"].ToString().Equals("0"))
                                {
                                    attributesList.Add(new { is_taxonomy = false, is_visible = _att_value["is_visible"], is_variation = _att_value["is_variation"], taxonomy_name = att.Key, display_name = _att_value["name"], attribute_type = "text", option = _att_value["value"] });
                                }
                                else
                                {
                                    if (rows.Length > 0) attributesList.Add(new { is_taxonomy = true, is_visible = _att_value["is_visible"], is_variation = _att_value["is_variation"], taxonomy_name = att.Key, display_name = rows[0]["attribute_label"], attribute_type = rows[0]["attribute_type"], option = (!string.IsNullOrEmpty(rows[0]["term"].ToString()) ? JsonConvert.DeserializeObject<List<dynamic>>(rows[0]["term"].ToString()) : JsonConvert.DeserializeObject<List<dynamic>>("[]")) });
                                    else attributesList.Add(new { is_taxonomy = true, is_visible = _att_value["is_visible"], is_variation = _att_value["is_variation"], taxonomy_name = att.Key, display_name = _att_value["name"], attribute_type = "select", option = new List<dynamic>() });
                                }
                            }
                        }
                    }

                    obj.attributes = attributesList;
                    mainRecords.Add(obj);
                }

                JSONresult = JsonConvert.SerializeObject(mainRecords);
            }
            catch { }

            return Json(JSONresult, 0);
        }
        

    }

}
