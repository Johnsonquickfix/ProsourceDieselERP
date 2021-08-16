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
            if(usertype.Count == 0)
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

        public JsonResult BuyingPrice(ProductModel model)
        {
            JsonResult result = new JsonResult();
            DateTime dateinc = DateTime.Now;
            //DateTime dateinc = UTILITIES.CommonDate.CurrentDate();
            var resultOne = 0;
            if (model.ID > 0) 
                resultOne = ProductRepository.updateBuyingtProduct(model, dateinc);
            else
                resultOne = ProductRepository.AddBuyingtProduct(model, dateinc);
            if (resultOne > 0)
            {
                return Json(new { status = true, message = "updated successfully!!", url = "Manage" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }            
        }
        public JsonResult Createwarehouse(ProductModel model)
        {
            JsonResult result = new JsonResult();
            DateTime dateinc = DateTime.Now;
            //DateTime dateinc = UTILITIES.CommonDate.CurrentDate();
            var resultOne = 0;
            if (model.ID > 0)
                resultOne = ProductRepository.updateProductwarehouse(model, dateinc);
            else
                resultOne = ProductRepository.AddProductwarehouse(model, dateinc);
            if (resultOne > 0)
            {
                return Json(new { status = true, message = "updated successfully!!", url = "Manage" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
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
                return Json(new { status = true, message = "deleted successfully!!", url = "Manage" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
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
                return Json(new { status = true, message = "deleted successfully!!", url = "Manage" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }
        }

        public JsonResult CreateProduct(ProductModel model)
        {
            if (model.ID > 0 || model.updatedID > 0)
            {
                model.post_type = "product";
                model.post_status = "publish";
                if (model.ID == 0)
                    model.ID = model.updatedID;
                if (!string.IsNullOrEmpty(model.post_content))
                    model.post_content = model.post_content;
                else
                    model.post_content = "";
                ProductRepository.EditProducts(model, model.ID);
                UpdateVariation_MetaData(model, model.ID);
                update_term(model, model.ID);
                return Json(new { status = true, message = "Product Record has been updated successfully!!", url = "Manage" }, 0);
            }
            else
            {
                model.post_status = "publish";
                model.post_type = "product";
                model.comment_status = "open";
                if (!string.IsNullOrEmpty(model.post_content))
                    model.post_content = model.post_content;
                else
                    model.post_content = "";
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
            string[] varQueryArr1 = new string[26];
            string[] varFieldsName = new string[26] { "_sku", "_regular_price", "_sale_price", "total_sales", "_tax_status", "_tax_class", "_manage_stock", "_backorders", "_sold_individually", "_weight", "_length", "_width", "_height", "_upsell_ids", "_crosssell_ids", "_virtual", "_downloadable", "_download_limit", "_download_expiry", "_stock", "_stock_status", "_wc_average_rating", "_wc_review_count", "_price", "_low_stock_amount", "_product_attributes" };
            string[] varFieldsValue = new string[26] { model.sku, model.regular_price, model.sale_price, "0", model.tax_status, model.tax_class, model.manage_stock, model.backorders, model.sold_individually, model.weight, model.length, model.width, model.height, model.upsell_ids, model.crosssell_ids, "no", "no", "-1", "-1", model.stock, model.stock_status, "0", "0", model.sale_price, model.low_stock_amount,model.product_attributes };
            for (int n = 0; n < 26; n++)
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
        private void Add_term(ProductModel model,int ID)
        {
            if(model.ProductTypeID > 0 )
            ProductRepository.Add_term(model.ProductTypeID,ID);
            if (model.ShippingclassID > 0)
                ProductRepository.Add_term(model.ShippingclassID,ID);
            string CommaStr = model.CategoryID;
            if (!string.IsNullOrEmpty(CommaStr))
            {
                var myarray = CommaStr.Split(',');
                for (var i = 0; i < myarray.Length; i++)
                {
                    ProductRepository.Add_term(Convert.ToInt32(myarray[i]), ID);

                }
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
                if (string.IsNullOrEmpty(myarray[i]) || myarray[i] == "undefined" || myarray[i] == "")
                {

                }
                else
                {
                    ProductRepository.Add_term(Convert.ToInt32(myarray[i]), Convert.ToInt32(ID));
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
            string[] varQueryArr1 = new string[21];
            string[] varFieldsName = new string[24] { "_sku", "_regular_price", "_sale_price", "total_sales", "_tax_status", "_tax_class", "_manage_stock", "_backorders", "_sold_individually", "_weight", "_length", "_width", "_height", "_upsell_ids", "_crosssell_ids", "_virtual", "_downloadable", "_download_limit", "_download_expiry", "_stock", "_stock_status", "_wc_average_rating", "_wc_review_count", "_low_stock_amount" };
            string[] varFieldsValue = new string[24] { model.sku, model.regular_price, model.sale_price, "0", model.tax_status, model.tax_class, model.manage_stock, model.backorders, model.sold_individually, model.weight, model.length, model.width, model.height, model.upsell_ids, model.crosssell_ids, "no", "no", "-1", "-1", model.stock, model.stock_status, "0", "0", model.low_stock_amount };
            for (int n = 0; n < 24; n++)
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
            try
            {

                DataTable dt = ProductRepository.GetDataByID(model);
                JSONresult = JsonConvert.SerializeObject(dt);
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
            model.post_status = "draft";
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
                    varFieldsName = "attribute_" + attributeheader[y].Trim();
                    ProductRepository.AddProductsMetaVariation(Convert.ToInt64(ID), varFieldsName, "");
                }
                return Json(new { status = true, message = "Product Attributes has been saved successfully!!", ID = ID }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", id = ID }, 0);
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
                return Json(new { status = true, message = "Product Attributes has been updated successfully!!", url = "Manage" }, 0);
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
                    return Json(new { status = true, message = "Product Attributes has been saved successfully!!", ID = ID }, 0);
                }
                else
                {
                    return Json(new { status = false, message = "Invalid Details", id = ID }, 0);
                }
            }

            //return Json(model, JsonRequestBehavior.AllowGet);
        }

        //public JsonResult Savevariations(string fields,string UpdateList, string UpdateID, string PID, string post_title,string regularprice, string Salepricevariationval, string Stockquantityvariationval, string allowbackordersvariationval, string weightvariationval, string Lvariationval, string Wvariationval, string Hvariationval, string shipvariationval, string cassvariationval, string descriptionvariationval, string stockchec, string chkvirtual, string sku, string parentid, string attributeheaderval , ProductModel model)
        //{

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

                int resl = ProductRepository.UpdateItemVariantStatus(model.ProductPostItemMeta);

                int respost = ProductRepository.UpdatePostStatus(model.ProductPostPostMeta);

                int reprice = ProductRepository.addprice(model.ProductPostPriceMeta);
            }
            catch { status = false; result = ""; }
            return Json(new { status = true, message = "Product Variations has been update successfully!!", ID = 1 }, 0);

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
            return Json(new { status = true, message = "update successfully!!", ID = 1 }, 0);            
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
            return Json(new { status = true, message = "update successfully!!", ID = 1 }, 0);
        }
    }
}