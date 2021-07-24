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
    public class ProductController : Controller
    {
        // Add Product
        public ActionResult AddNewProduct()
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
            ViewBag.product = usertype.Select(N => new SelectListItem { Text = N.Text, Value = N.Value.ToString() });

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
                
                   DataTable dt = ProductRepository.GetList(model.strValue1, model.strValue2, model.strValue3,model.strValue4, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
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

        public JsonResult CreateProduct(ProductModel model)
        {
            if (model.ID > 0)
            {

                ProductRepository.EditProducts(model, model.ID);
                Update_MetaData(model, model.ID);
                update_term(model, model.ID);
                return Json(new { status = true, message = "Product Record has been updated successfully!!", url = "Manage" }, 0);
            }
            else
            {
                int ID = ProductRepository.AddProducts(model);
                if (ID > 0)
                {
                    Adduser_MetaData(model, ID);
                    Add_term(model, ID);
                    ModelState.Clear();
                    return Json(new { status = true, message = "Product has been saved successfully!!", url = "" }, 0);
                }
                else
                {
                    return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
                }
            }
        }

        private void Adduser_MetaData(ProductModel model, long id)
        {
            string[] varQueryArr1 = new string[25];
            string[] varFieldsName = new string[25] { "_sku", "_regular_price", "_sale_price", "total_sales", "_tax_status", "_tax_class", "_manage_stock", "_backorders", "_sold_individually", "_weight", "_length", "_width", "_height", "_upsell_ids", "_crosssell_ids", "_virtual", "_downloadable", "_download_limit", "_download_expiry", "_stock", "_stock_status", "_wc_average_rating", "_wc_review_count", "_price", "_low_stock_amount" };
            string[] varFieldsValue = new string[25] { model.sku, model.regular_price, model.sale_price, "0", model.tax_status, model.tax_class, model.manage_stock, model.backorders, model.sold_individually, model.weight, model.length, model.width, model.height, model.upsell_ids, model.crosssell_ids, "no", "no", "-1", "-1", model.stock, model.stock_status, "0", "0", model.sale_price, model.low_stock_amount };
            for (int n = 0; n < 25; n++)
            {
                ProductRepository.AddProductsMeta(model, id, varFieldsName[n], varFieldsValue[n]);
            }
        }
        private void Add_term(ProductModel model,int ID)
        {
            ProductRepository.Add_term(model.ProductTypeID,ID);
            ProductRepository.Add_term(model.ShippingclassID,ID);
            string CommaStr = model.CategoryID;

            var myarray = CommaStr.Split(',');

            for (var i = 0; i < myarray.Length; i++)
            {
                ProductRepository.Add_term(Convert.ToInt32(myarray[i]), ID);
                 
            }
        }
        private void update_term(ProductModel model, long ID)
        {
            delete_term(model, ID);
            ProductRepository.Add_term(model.ProductTypeID,Convert.ToInt32(ID));
            ProductRepository.Add_term(model.ShippingclassID, Convert.ToInt32(ID));
            string CommaStr = model.CategoryID;

            var myarray = CommaStr.Split(',');

            for (var i = 0; i < myarray.Length; i++)
            {
                ProductRepository.Add_term(Convert.ToInt32(myarray[i]), Convert.ToInt32(ID));

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

        public JsonResult GetDataByID(OrderPostStatusModel model)
        {
            string JSONresult = string.Empty;
            try
            {

                DataTable dt = ProductRepository.GetDataByID(model);
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

                DataTable dt = ProductRepository.GetProdctByID(model);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }
    }
}