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
            if (model.ID > 0 || model.updatedID > 0)
            {
                model.ID = model.updatedID;
                ProductRepository.EditProducts(model, model.ID);
                Update_MetaData(model, model.ID);
                update_term(model, model.ID);
                return Json(new { status = true, message = "Product Record has been updated successfully!!", url = "Manage" }, 0);
            }
            else
            {
                model.post_status = "publish";
                model.post_type = "product";
                model.comment_status = "open";
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
                if(myarray[i] != "")
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

 
        public JsonResult saveAttributes(string fields,string post_title, string table,string visible,string variation, ProductModel model)
        {
         
           // Attributes model = new Attributes();            
            //var quote = "\"";
            //string sColumns = "";
            //string value = "";
            //string[] name = fields.Split(',');
            //foreach (string namelist in name)
            //{
            //    sColumns += quote + namelist +quote + ",";
            // }
            //string NameTrimed = sColumns.TrimEnd(',');
            //string[] val = table.Split(',');
            //foreach (string namelistval in val)
            //{
            //    value += quote + namelistval + quote + ",";
            //}
            //string valueTrimed = value.TrimEnd(',');
            //string key = "{ Key : " + NameTrimed + " }";
            //string valuename = "{ value : " + valueTrimed + " }";
            //string product_attributes = key + "," + valuename;
          
            model.product_attributes = fields;
            if (model.ID > 0)
            {

                ProductRepository.EditProducts(model, model.ID);
                Update_MetaData(model, model.ID);
                update_term(model, model.ID);
                return Json(new { status = true, message = "Product Record has been updated successfully!!", url = "Manage" }, 0);
            }
            else
            {
                model.post_status = "draft";
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
                    Add_term(model, ID);
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

        public JsonResult Savevariations(string fields, string post_title,string regularprice, string Salepricevariationval, string Stockquantityvariationval, string allowbackordersvariationval, string weightvariationval, string Lvariationval, string Wvariationval, string Hvariationval, string shipvariationval, string cassvariationval, string descriptionvariationval, string stockchec, string chkvirtual, string sku, string parentid, string attributeheaderval , ProductModel model)
        {                       
           
            if (model.ID > 0)
            {

                //ProductRepository.EditProducts(model, model.ID);
                //Update_MetaData(model, model.ID);
                //update_term(model, model.ID);
                //return Json(new { status = true, message = "Product Record has been updated successfully!!", url = "Manage" }, 0);
            }
            else
            {
                string[] elements = fields.Split(',');

                model.post_status = "publish";
                model.post_type = "product";
                model.post_content = "";
                model.post_title = post_title;
                model.post_name = post_title;
                model.post_type = "product_variation";
                model.comment_status = "closed";
                
                if (!string.IsNullOrEmpty(parentid))
                    model.post_parent = Convert.ToInt32(parentid);
                else
                    model.post_parent = 0;
                string value = "";
                string[] skuval = sku.Split(',');

                string[] regularpriceval = regularprice.Split(',');
                string[] Salepricl = Salepricevariationval.Split(',');

                string[] weightvariation = weightvariationval.Split(',');
                string[] Lvariation = Lvariationval.Split(',');
                string[] Wvariation = Wvariationval.Split(',');
                string[] Hvariation = Hvariationval.Split(',');

                string[] Stockquantityvariation = Stockquantityvariationval.Split(',');
                string[] allowbackordersvariation = allowbackordersvariationval.Split(',');
                string[] shipvariation = shipvariationval.Split(',');
                string[] cassvariation = cassvariationval.Split(',');

                string[] descriptionvariation = descriptionvariationval.Split(',');
                string[] stockchecval = stockchec.Split(',');
                string[] chkvirtu = chkvirtual.Split(',');
               // attributeheaderval = "Size,Color";
                string[] attributeheader = attributeheaderval.Split(',');

                foreach (string Skulistval in skuval)
                {
                    int ID = ProductRepository.AddProducts(model);
                    if (ID > 0)
                    {
                        value += ID + ",";

                    }
                    else
                    {
                        value = "";
                    }
                }
                string pricevalereg = "";
                 string PostID = value.TrimEnd(',');  

               // string PostID = "1,2,3";
                string[] PostIDs = PostID.Split(','); 

                string varFieldsName = string.Empty;
                string varFieldsValue = string.Empty;
                for (int x = 0; x < PostIDs.Length; x++)
                {
                    for (int y = 0; y < attributeheader.Length; y++)
                    {
                        varFieldsName = "attribute_"+ attributeheader[y];
                        int r = 0;
                        if (x > 0)
                        {
                            if (x == 2)
                            {
                                if (y > 0)
                                    r = x + 3;
                                else
                                    r = x + 2;
                            }
                            else
                            {
                                if (y > 0)
                                    r = x + 2;
                                else
                                    r = x + 1;
                            }
                        }                      
                        else
                            r = y;

                            for (int z = r; z < elements.Length; z++)
                            {
                                varFieldsValue = elements[z];
                                ProductRepository.AddProductsMetaVariation(Convert.ToInt64(PostIDs[x]), varFieldsName, varFieldsValue);
                                ProductRepository.UpdateProductsVariation(model.post_title + "-"+ varFieldsValue, attributeheader[y] + ": " +varFieldsValue, Convert.ToInt64(PostIDs[x]));
                            break;
                            }
                        
                    }
                }

                for (int x = 0; x < PostIDs.Length; x++)
                {
                    for (int y = x; y < regularpriceval.Length; y++)
                    {

                        varFieldsName = "_regular_price";
                        varFieldsValue = regularpriceval[y];
                        ProductRepository.AddProductsMetaVariation(Convert.ToInt64(PostIDs[x]), varFieldsName, varFieldsValue);
                        ProductRepository.AddProductsMetaVariation(Convert.ToInt64(PostIDs[x]), "total_sales", "0");
                        ProductRepository.AddProductsMetaVariation(Convert.ToInt64(PostIDs[x]), "_download_expiry", "-1");
                        break;
                    }
                    for (int z = x; z < Salepricl.Length; z++)
                    {
                        varFieldsName = "_sale_price";
                        varFieldsValue = Salepricl[z];
                        ProductRepository.AddProductsMetaVariation(Convert.ToInt64(PostIDs[x]), varFieldsName, varFieldsValue);
                        ProductRepository.AddProductsMetaVariation(Convert.ToInt64(PostIDs[x]), "_price", varFieldsValue);
                        ProductRepository.AddProductsMetaVariation(Convert.ToInt64(PostIDs[x]), "_download_limit", "no");
                        break;
                    }
                    for (int w = x; w < skuval.Length; w++)
                    {
                        varFieldsName = "_sku";
                        varFieldsValue = skuval[w];
                        ProductRepository.AddProductsMetaVariation(Convert.ToInt64(PostIDs[x]), varFieldsName, varFieldsValue);
                        //ProductRepository.AddProductsMetaVariation(Convert.ToInt64(PostIDs[x]), varFieldsName, varFieldsValue);
                        ProductRepository.AddProductsMetaVariation(Convert.ToInt64(PostIDs[x]), "_downloadable", "no");
                        break;
                    }
                }

                for (int x = 0; x < PostIDs.Length; x++)
                {
                    for (int y = x; y < weightvariation.Length; y++)
                    {

                        varFieldsName = "_weight";
                        varFieldsValue = weightvariation[y];
                        ProductRepository.AddProductsMetaVariation(Convert.ToInt64(PostIDs[x]), varFieldsName, varFieldsValue);
                        ProductRepository.AddProductsMetaVariation(Convert.ToInt64(PostIDs[x]), "_sold_individually", "no");
                        break;
                    }
                    for (int z = x; z < Lvariation.Length; z++)
                    {
                        varFieldsName = "_length";
                        varFieldsValue = Lvariation[z];
                        ProductRepository.AddProductsMetaVariation(Convert.ToInt64(PostIDs[x]), varFieldsName, varFieldsValue);
                        ProductRepository.AddProductsMetaVariation(Convert.ToInt64(PostIDs[x]), "_tax_status", "taxable");
                        break;
                    }
                    for (int w = x; w < Wvariation.Length; w++)
                    {
                        varFieldsName = "_width";
                        varFieldsValue = Wvariation[w];
                        ProductRepository.AddProductsMetaVariation(Convert.ToInt64(PostIDs[x]), varFieldsName, varFieldsValue);
                        ProductRepository.AddProductsMetaVariation(Convert.ToInt64(PostIDs[x]), "_wc_review_count", "0");
                        break;
                    }
                    for (int u = x; u < Hvariation.Length; u++)
                    {
                        varFieldsName = "_height";
                        varFieldsValue = Hvariation[u];
                        ProductRepository.AddProductsMetaVariation(Convert.ToInt64(PostIDs[x]), varFieldsName, varFieldsValue);
                        ProductRepository.AddProductsMetaVariation(Convert.ToInt64(PostIDs[x]), "_wc_average_rating", "0");
                        ProductRepository.AddProductsMetaVariation(Convert.ToInt64(PostIDs[x]), "_stock_status", "instock");
                        break;
                    }
                    
                }

                for (int x = 0; x < PostIDs.Length; x++)
                {
                   
                    for (int y = x; y < cassvariation.Length; y++)
                    {

                        varFieldsName = "_tax_class";
                        varFieldsValue = cassvariation[y];
                        ProductRepository.AddProductsMetaVariation(Convert.ToInt64(PostIDs[x]), varFieldsName, varFieldsValue);
                        break;
                    }
                    for (int z = x; z < allowbackordersvariation.Length; z++)
                    {
                        varFieldsName = "_backorders";
                        varFieldsValue = allowbackordersvariation[z];
                        ProductRepository.AddProductsMetaVariation(Convert.ToInt64(PostIDs[x]), varFieldsName, varFieldsValue);
                   
                        break;
                    }
                    for (int w = x; w < Stockquantityvariation.Length; w++)
                    {
                        varFieldsName = "_stock";
                        varFieldsValue = Stockquantityvariation[w];
                        ProductRepository.AddProductsMetaVariation(Convert.ToInt64(PostIDs[x]), varFieldsName, varFieldsValue);
                  
                        break;
                    }
                    for (int v = x; v < descriptionvariation.Length; v++)
                    {
                        varFieldsName = "_variation_description";
                        varFieldsValue = descriptionvariation[v];
                        ProductRepository.AddProductsMetaVariation(Convert.ToInt64(PostIDs[x]), varFieldsName, varFieldsValue);

                        break;
                    }

                    for (int u = x; u < shipvariation.Length; u++)
                    {
                        ProductRepository.Add_term(Convert.ToInt32(shipvariation[u]), Convert.ToInt32(PostIDs[x]));
                        break;
                    }

                   
                }
            }
                return Json(new { status = true, message = "Product Variations has been saved successfully!!", ID = 1 }, 0);
         
                //else
                //{
                //    return Json(new { status = false, message = "Invalid Details", id = ID}, 0);
                //}
 
        }
    }
}