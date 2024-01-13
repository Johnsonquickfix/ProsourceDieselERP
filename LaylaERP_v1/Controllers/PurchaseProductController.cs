using LaylaERP.BAL;
using LaylaERP.Models;
using LaylaERP.UTILITIES;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Dynamic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LaylaERP_v1.Controllers
{
    public class PurchaseProductController : Controller
    {
        // GET: PurchaseProduct
        public ActionResult ListProduct()
        {
            return View();
        }
        public ActionResult AddNewProduct()
        {
            DataTable dt = new DataTable();
            string id = "";
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
            string returnValue = string.Empty;
            string space = "#";
            for (var index = 0; index < noOfSpaces; index++)
            {
                returnValue += space;
            }             
            return returnValue;
        }
        public ActionResult AddNewPurchase()
        {
            return View();
        }
        [HttpPost]
        public JsonResult GetCount(SearchModel model)
        {
            string result = string.Empty;
            try
            {
                DataTable dt = PurchaseProductRepository.GetCounts();
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }
        [HttpGet]
        public JsonResult GetProductList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = PurchaseProductRepository.GetProductList(model.strValue1, model.strValue2, model.strValue3, model.strValue4, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, aaData = result }, 0);
        }

        public JsonResult UpdateproductcomponentStatus(AccountingJournalModel model)
        {
            if (model.rowid > 0)
            {
                new PurchaseProductRepository().UpdateproductcomponentStatus(model);
                return Json(new { status = true, message = "Component status changed successfully!!", url = "", id = model.rowid }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Something went wrong!!", url = "", id = 0 }, 0);
            }
        }
        [HttpPost]
        public JsonResult Changestatus(OrderPostStatusModel model)
        {
            string strID = model.strVal;
            if (strID != "")
            {
                PurchaseProductRepository or = new PurchaseProductRepository();
                or.Changestatus(model, strID);
                return Json(new { status = true, message = "Product stats update successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Something went wrong", url = "" }, 0);
            }

        }

        public JsonResult Getvariationdetailsbyid(OrderPostStatusModel model)
        {
            string JSONresult = string.Empty;
            List<dynamic> mainRecords = new List<dynamic>();

            try
            {
                LaylaERP.UTILITIES.Serializer serializer = new LaylaERP.UTILITIES.Serializer();
                DataSet ds = PurchaseProductRepository.getvariationdetailsbyid(model);

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

        public JsonResult Getlatestattributesbyid(OrderPostStatusModel model)
        {
            string JSONresult = string.Empty;
            List<dynamic> mainRecords = new List<dynamic>();

            try
            {
                LaylaERP.UTILITIES.Serializer serializer = new LaylaERP.UTILITIES.Serializer();
                DataSet ds = PurchaseProductRepository.Getlatestattributesbyid(model);

                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    dynamic obj = new ExpandoObject();
                    obj.cast_prise = dr["cast_prise"];
                     

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

        public JsonResult savevariantproduct(string fields, string parentid, ProductModel model)
        {
            string[] attributeheader = fields.Split(',');
            string varFieldsName = string.Empty;
            string varFieldsValue = string.Empty; 
            model.post_content = "";
            model.post_type = "purchase_product_variation";
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

                int resl = ProductRepository.UpdateItemVariantStatus(model.ProductPostItemMeta);

                // int resl = ProductRepository.UpdateshippingVariantStatus(model.ProductPostItemMeta);

                int respost = ProductRepository.UpdatePostStatus(model.ProductPostPostMeta);

                int reprice = ProductRepository.addprice(model.ProductPostPriceMeta);
            }
            catch { status = false; result = ""; }
            return Json(new { status = true, message = "Product variations update successfully!!", ID = 1 }, 0); 
        }

        public JsonResult saveproductAttributes(string fields, string IDs, string post_title, string term_taxonomy, string term_taxonomy_id, string producttypeID, ProductModel model)
        {
            model.product_attributes = fields;
            if ((IDs != "NaN"))
            {

                // ProductRepository.EditProducts(model, model.ID);
                Update_AttributeMeta(model, Convert.ToInt64(IDs), term_taxonomy, term_taxonomy_id);
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
                model.post_type = "purchase_product";
                model.comment_status = "open";
                int ID = ProductRepository.AddProducts(model);
                ViewBag.UpdatedID = ID;
                if (ID > 0)
                {
                    Adduser_MetaData(model, ID);
                    ProductRepository.Add_term(Convert.ToInt32(producttypeID), ID);
                    //Add_term(model, ID);
                    ProductRepository.UpdateattributMetaData(model, "IM", ID, "", "", term_taxonomy, term_taxonomy_id);

                    ModelState.Clear();
                    return Json(new { status = true, message = "Product attributes saved successfully!!", ID = ID }, 0);
                }
                else
                {
                    return Json(new { status = false, message = "Invalid details", id = ID }, 0);
                }
            }

            // return Json(model, JsonRequestBehavior.AllowGet);
        }

        private void Update_AttributeMeta(ProductModel model, long id, string term_taxonomy, string term_taxonomy_id)
        {
            string[] varQueryArr1 = new string[1];
            string[] varFieldsName = new string[1] { "_product_attributes" };
            string[] varFieldsValue = new string[1] { model.product_attributes };
            for (int n = 0; n < 1; n++)
            {
                ProductRepository.UpdateattributMetaData(model, "UM", id, varFieldsName[n], varFieldsValue[n], term_taxonomy, term_taxonomy_id);
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

        public JsonResult CreateProduct(ProductModel model)
        {
            if (model.ID > 0 || model.updatedID > 0)
            {
                long PID = model.ID > 0 ? model.ID : model.updatedID;
                UserActivityLog.WriteDbLog(LogType.Submit, "product id (" + PID + ") updated in list product", "/Product/AddNewProduct" + ", " + Net.BrowserInfo);
                model.post_type = "purchase_product";
                //  model.post_status = "publish";
                if (model.ID == 0)
                    model.ID = model.updatedID;
                if (!string.IsNullOrEmpty(model.post_content))
                    model.post_content = model.post_content;
                else
                    model.post_content = "";
               PurchaseProductRepository.EditProducts(model, model.ID);
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
                model.post_type = "purchase_product";
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
            ProductRepository.Add_termproducttype(model.ProductTypeID, Convert.ToInt32(ID));
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
                    if (Convert.ToInt32(myarray[i]) > 0)
                    {
                        ProductRepository.Add_term(Convert.ToInt32(myarray[i]), Convert.ToInt32(ID));
                        ProductRepository.update_countinc(Convert.ToInt32(myarray[i]), Convert.ToInt32(ID));
                    }
                }
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

        public JsonResult GetDataByID(OrderPostStatusModel model)
        {
            string JSONresult = string.Empty;
            dynamic obj = new ExpandoObject();
            try
            {
                LaylaERP.UTILITIES.Serializer serializer = new LaylaERP.UTILITIES.Serializer();
                DataSet ds = PurchaseProductRepository.GetDataByID(model);
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
                    obj.shippingclassID = dr["shippingclassID"];
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
                                obj.attributes.Add(new { position = _att_value["position"], is_taxonomy = false, is_visible = _att_value["is_visible"], is_variation = _att_value["is_variation"], taxonomy_name = att.Key, display_name = _att_value["name"], attribute_type = "text", option = _att_value["value"] });
                            }
                            else
                            {
                                if (rows.Length > 0) obj.attributes.Add(new { position = _att_value["position"], is_taxonomy = true, is_visible = _att_value["is_visible"], is_variation = _att_value["is_variation"], taxonomy_name = att.Key, display_name = rows[0]["attribute_label"], attribute_type = rows[0]["attribute_type"], option = (!string.IsNullOrEmpty(rows[0]["term"].ToString()) ? JsonConvert.DeserializeObject<List<dynamic>>(rows[0]["term"].ToString()) : JsonConvert.DeserializeObject<List<dynamic>>("[]")) });
                                else obj.attributes.Add(new { position = _att_value["position"], is_taxonomy = true, is_visible = _att_value["is_visible"], is_variation = _att_value["is_variation"], taxonomy_name = att.Key, display_name = _att_value["name"], attribute_type = "select", option = new List<dynamic>() });
                            }
                        }
                    }
                }
                JSONresult = JsonConvert.SerializeObject(obj);
            }
            catch { }
            return Json(JSONresult, 0);
        }



    }
}