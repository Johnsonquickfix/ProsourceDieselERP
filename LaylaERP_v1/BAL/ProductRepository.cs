using LaylaERP.DAL;
using LaylaERP.Models;
using System.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Http.Results;
using System.Web.Mvc;
using LaylaERP.UTILITIES;

namespace LaylaERP.BAL
{
    public class ProductRepository
    {

        public static DataTable GetCounts()
        {
            DataTable dt = new DataTable();
            try
            {
                string strWhr = string.Empty;

                //string strSql = "select sum(case when post_status not in('auto-draft','trash') then 1 else 0 end) AllOrder,"
                //            + " sum(case when post_status = 'publish' then 1 else 0 end) Publish,"
                //            + " sum(case post_status when 'private' then 1 else 0 end) Private,"
                //            + " sum(case when post_status = 'trash' then 1 else 0 end) Trash"
                //            + " from wp_posts p where p.post_type = 'product' and post_status != 'draft'";

                string strSql = "select sum(case when post_status not in('auto-draft') then 1 else 0 end) AllOrder,"
                          + " sum(case when post_status = 'publish' then 1 else 0 end) Publish,"
                          + " sum(case when post_status = 'publish' then 1 else 0 end)+sum(case post_status when 'private' then 1 else 0 end) Private,"
                          + " sum(case when post_status = 'trash' then 1 else 0 end) Trash"
                          + " from wp_posts p where p.post_type = 'product' and post_status != 'draft'";

                //string strSql = "select sum(case when post_status not in('auto-draft') then 1 else 0 end) AllOrder,"
                //         + " sum(case when post_status = 'publish' then 1 else 0 end) Publish,"
                //         + " sum(case when post_status = 'publish' then 1 else 0 end)+sum(case post_status when 'private' then 1 else 0 end) Private,"
                //         + " sum(case when post_status = 'trash' then 1 else 0 end) Trash"
                //         + " from wp_posts p where p.post_type in ('product', 'product_variation') and post_status != 'draft'";

                dt = SQLHelper.ExecuteDataTable(strSql);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static DataTable GetCategoryType_Old()
        {
            DataTable dtr = new DataTable();
            try
            {
                string strquery = "SELECT t.term_id,CONCAT(name,' ','(', count,')') NameCount FROM wp_terms AS t Left JOIN wp_term_taxonomy AS tt ON tt.term_id = t.term_id Left JOIN wp_term_relationships AS tr ON tr.term_taxonomy_id = tt.term_taxonomy_id WHERE tt.taxonomy IN('product_cat') GROUP by t.term_id";
                dtr = SQLHelper.ExecuteDataTable(strquery);
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        public static DataTable GetCategoryType()
        {
            DataTable dtr = new DataTable();
            try
            {
                string strquery = "SELECT t.term_id,CONCAT(name,' ','(', count,')') NameCount FROM wp_terms AS t Left JOIN wp_term_taxonomy AS tt ON tt.term_id = t.term_id Left JOIN wp_term_relationships AS tr ON tr.term_taxonomy_id = tt.term_taxonomy_id left join wp_termmeta tm_a on tm_a.term_id = t.term_id and tm_a.meta_key = 'Is_Active' WHERE taxonomy = 'product_cat' and coalesce(tm_a.meta_value,'1') = '1' GROUP by t.term_id";
                dtr = SQLHelper.ExecuteDataTable(strquery);
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }
        public static DataSet GetDataByID(OrderPostStatusModel model)
        {
            DataSet ds = new DataSet();
            try
            {
                string strWhr = string.Empty;
                SqlParameter[] para = { new SqlParameter("@strVal", model.strVal), };
                string strSql = "erp_getproductdetailsbyid";

                ds = SQLHelper.ExecuteDataSet(strSql, para);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }

        public static DataTable GetDataBuyingByID(OrderPostStatusModel model)
        {
            DataTable dt = new DataTable();

            try
            {
                string strWhr = string.Empty;

                string strSql = "SELECT rowid ID,fk_vendor,Cast(CONVERT(DECIMAL(10,2),purchase_price) as nvarchar) purchase_price,Cast(CONVERT(DECIMAL(10,2),cost_price) as nvarchar) cost_price,minpurchasequantity,salestax,taxrate,discount,remark,taglotserialno,Cast(CONVERT(DECIMAL(10,2),shipping_price) as nvarchar) shipping_price,Misc_Costs from Product_Purchase_Items"
                             + " WHERE rowid = " + model.strVal + " ";


                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dt = ds.Tables[0];

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static DataTable GetShipEditDataID(OrderPostStatusModel model)
        {
            DataTable dt = new DataTable();

            try
            {
                string strWhr = string.Empty;

                string strSql = "SELECT rowid ID,Shippingclass_Name ShipName,fk_ShippingID,countrycode ,statecode,Statefullname,Method,Shipping_price,Type,taxable  from ShippingClass_Details ScD left OUTER join Shipping_class sc on sc.id = ScD.fk_ShippingID left outer join erp_StateList esl on esl.State = ScD.statecode"
                             + " WHERE rowid = " + model.strVal + " ";


                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dt = ds.Tables[0];

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static DataTable GetDataProductwarehouseByID(OrderPostStatusModel model)
        {
            DataTable dt = new DataTable();

            try
            {
                string strWhr = string.Empty;

                string strSql = "SELECT rowid ID,fk_product,fk_warehouse from product_warehouse"
                             + " WHERE rowid = " + model.strVal + " ";


                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dt = ds.Tables[0];

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static List<ProductsModelDetails> GetProductListDetails(string strValue1, string strValue2)
        {
            List<ProductsModelDetails> _list = new List<ProductsModelDetails>();
            try
            {
                string free_products = string.Empty;

                ProductsModelDetails productsModel = new ProductsModelDetails();
                string strWhr = string.Empty;

                if (string.IsNullOrEmpty(strValue1) && string.IsNullOrEmpty(strValue2))
                {

                }
                else
                {


                    if (!string.IsNullOrEmpty(strValue2))
                    {
                        strWhr += " and t.term_id = " + strValue2;

                        if (string.IsNullOrEmpty(strValue1))
                            strValue1 = "";
                        //string strSQl = "SELECT distinct p.ID,t.term_id, post_title,REPLACE(post_title, ' ', '_') title, t.name AS product_category"
                        //            + " FROM wp_posts p"
                        //            + "  LEFT JOIN wp_term_relationships AS tr ON tr.object_id = p.ID"
                        //            + "  LEFT JOIN wp_term_taxonomy AS tt ON tt.term_taxonomy_id = tr.term_taxonomy_id"
                        //            + "  JOIN wp_terms AS t ON t.term_id = tt.term_id"
                        //            + " WHERE p.post_type in('product','product_variation') and tt.taxonomy IN('product_cat','product_type') " + strWhr;

                        //string strSQl = "select distinct pp.ID,t.term_id, pp.post_title,REPLACE(pp.post_title, ' ', '_') title, t.name AS product_category"
                        //         + " FROM wp_posts p"
                        //         + "  LEFT JOIN wp_posts AS pp ON pp.post_parent = p.ID"
                        //         + "  LEFT JOIN wp_term_relationships AS tr ON tr.object_id = p.ID"
                        //         + "  LEFT JOIN wp_term_taxonomy AS tt ON tt.term_taxonomy_id = tr.term_taxonomy_id"
                        //         + "  JOIN wp_terms AS t ON t.term_id = tt.term_id"
                        //         + " WHERE p.post_type in('product','product_variation') and tt.taxonomy IN('product_cat','product_type') " + strWhr;

                        //string strSQl = "select distinct case when  pp.post_parent is null then p.ID else pp.ID end ID,t.term_id,case when  pp.post_parent is null then p.post_title else pp.post_title end post_title,case when  pp.post_parent is null then p.post_title else pp.post_title end title,t.name AS product_category"
                        // + " FROM wp_posts p"
                        // + "  LEFT JOIN wp_posts AS pp ON pp.post_parent = p.ID and pp.post_status = 'publish'"
                        // + "  LEFT JOIN wp_term_relationships AS tr ON tr.object_id = p.ID"
                        // + "  LEFT JOIN wp_term_taxonomy AS tt ON tt.term_taxonomy_id = tr.term_taxonomy_id"
                        // + "  JOIN wp_terms AS t ON t.term_id = tt.term_id"
                        // + " WHERE p.post_type in('product','product_variation') and tt.taxonomy IN('product_cat','product_type') and p.post_status = 'publish' " + strWhr;



                        SqlParameter[] para = {
                        new SqlParameter("@term_id", strValue2),
                        new SqlParameter("@post_title", strValue1),
                    };
                        string strSQl = "erp_getproductkitbyid";

                        //strSQl += ";";
                        SqlDataReader sdr = SQLHelper.ExecuteReader(strSQl, para);
                        while (sdr.Read())
                        {
                            productsModel = new ProductsModelDetails();
                            if (sdr["id"] != DBNull.Value)
                                productsModel.ID = Convert.ToInt64(sdr["id"]);
                            else
                                productsModel.ID = 0;

                            productsModel.Qty = 0;

                            if (sdr["post_title"] != DBNull.Value)
                                productsModel.product_name = sdr["post_title"].ToString();
                            else
                                productsModel.product_name = string.Empty;

                            if (sdr["title"] != DBNull.Value)
                                productsModel.product_label = sdr["title"].ToString();
                            else
                                productsModel.product_label = string.Empty;

                            _list.Add(productsModel);
                        }
                    }
                }
            }
            catch (Exception ex)
            { throw ex; }
            return _list;
        }

        public static List<ProductModelservices> GetProductservices(string strValue1, string strValue2)
        {
            List<ProductModelservices> _list = new List<ProductModelservices>();
            try
            {
                string free_products = string.Empty;

                ProductModelservices productsModel = new ProductModelservices();
                string strWhr = string.Empty;

                if (string.IsNullOrEmpty(strValue1) && string.IsNullOrEmpty(strValue2))
                {

                }
                else
                {
                    if (!string.IsNullOrEmpty(strValue1))
                        //    strWhr += " and fk_product = " + strValue1 ;    
                        //string strSQl = "SELECT distinct fk_product_fils ID,wp.post_title,post_title title,'$00.00' buyingprice,'$00' sellingpric, 0 Stock ,qty"
                        //            + " FROM product_association p"
                        //            + "  left outer join wp_posts wp on wp.ID = p.fk_product_fils"                                
                        //            + " WHERE wp.post_type in('product','product_variation') " + strWhr;

                        //    strWhr += " and p.fk_product = " + strValue1;
                        //string strSQl = "SELECT distinct fk_product_fils ID,wp.post_title,post_title title,ifnull((SELECT min(FORMAT(purchase_price,2)) purchase_price from Product_Purchase_Items where fk_product = p.fk_product_fils),'0.00') buyingprice,ifnull(FORMAT(pmsaleprice.meta_value,2),'0.00') sellingpric,0 Stock ,qty"
                        //            + " FROM product_association p"
                        //            + "  left outer join wp_posts wp on wp.ID = p.fk_product_fils"
                        //            + "  left join wp_postmeta pmsaleprice on wp.ID = pmsaleprice.post_id and pmsaleprice.meta_key = '_sale_price'"
                        //            + "  WHERE wp.post_type in('product','product_variation') " + strWhr;

                        strWhr += " and p.product_id = " + strValue1;
                    string strSQl = "SELECT distinct free_product_id ID,wp.post_title,post_title title,  isnull((SELECT min(Cast(CONVERT(DECIMAL(10,2),cost_price) as nvarchar)) purchase_price from Product_Purchase_Items where fk_product = p.free_product_id),'0.00') buyingprice,isnull(Cast(CONVERT(DECIMAL(10,2),pmsaleprice.meta_value) as nvarchar),'0.00') sellingpric,0 Stock , free_quantity qty,product_type_name,status"
                                + " FROM wp_product_free p"
                                + "  left outer join wp_posts wp on wp.ID = p.free_product_id"
                                + "  left join wp_postmeta pmsaleprice on wp.ID = pmsaleprice.post_id and pmsaleprice.meta_key = '_sale_price'   left outer join erp_product_type ept on ept.rowid = p.product_type_id"
                                + "  WHERE wp.post_type in('product','product_variation') " + strWhr;


                    strSQl += ";";
                    SqlDataReader sdr = SQLHelper.ExecuteReader(strSQl);
                    while (sdr.Read())
                    {
                        productsModel = new ProductModelservices();
                        if (sdr["ID"] != DBNull.Value)
                            productsModel.ID = Convert.ToInt64(sdr["ID"]);
                        else
                            productsModel.ID = 0;

                        productsModel.qty = Convert.ToInt32(sdr["qty"]);
                        productsModel.Stock = sdr["Stock"].ToString();
                        productsModel.buyingprice = sdr["buyingprice"].ToString();
                        productsModel.sellingpric = sdr["sellingpric"].ToString();
                        productsModel.product_label = sdr["title"].ToString();
                        //productsModel.product_type_id = Convert.ToInt32(sdr["product_type_id"]);
                        productsModel.status = Convert.ToInt32(sdr["status"]);
                        if (sdr["post_title"] != DBNull.Value)
                            productsModel.product_name = sdr["post_title"].ToString();
                        else
                            productsModel.product_name = string.Empty;

                        productsModel.product_type_name = sdr["product_type_name"].ToString();

                        _list.Add(productsModel);
                    }
                }
            }
            catch (Exception ex)
            { throw ex; }
            return _list;
        }

        public static List<ProductModelservices> GetComponentProductservices(string strValue1, string strValue2)
        {
            List<ProductModelservices> _list = new List<ProductModelservices>();
            try
            {
                string free_products = string.Empty;

                ProductModelservices productsModel = new ProductModelservices();
                string strWhr = string.Empty;

                if (string.IsNullOrEmpty(strValue1) && string.IsNullOrEmpty(strValue2))
                {

                }
                else
                {
                    if (!string.IsNullOrEmpty(strValue1))
 
                        strWhr += " and p.product_id = " + strValue1;
                    string strSQl = "SELECT distinct rowid ID,wp.post_title,post_title title,  isnull((SELECT min(Cast(CONVERT(DECIMAL(10,2),purchase_price) as nvarchar)) purchase_price from Product_Purchase_Items where fk_product = p.component_product_id),'0.00') buyingprice,isnull(Cast(CONVERT(DECIMAL(10,2),pmsaleprice.meta_value) as nvarchar),'0.00') sellingpric,0 Stock , status status,component_quantity qty "
                                + " FROM erp_product_component p"
                                + "  left outer join wp_posts wp on wp.ID = p.component_product_id"
                                + "  left join wp_postmeta pmsaleprice on wp.ID = pmsaleprice.post_id and pmsaleprice.meta_key = '_sale_price'"
                                + "  WHERE wp.post_type in('product','product_variation') " + strWhr;

                    strSQl += ";";
                    SqlDataReader sdr = SQLHelper.ExecuteReader(strSQl);
                    while (sdr.Read())
                    {
                        productsModel = new ProductModelservices();
                        if (sdr["ID"] != DBNull.Value)
                            productsModel.ID = Convert.ToInt64(sdr["ID"]);
                        else
                            productsModel.ID = 0;

                        productsModel.qty = Convert.ToInt32(sdr["qty"]);
                        productsModel.status = Convert.ToInt32(sdr["status"]);
                        productsModel.Stock = sdr["Stock"].ToString();
                        productsModel.buyingprice = sdr["buyingprice"].ToString();
                        productsModel.sellingpric = sdr["sellingpric"].ToString();
                        productsModel.product_label = sdr["title"].ToString();
                        if (sdr["post_title"] != DBNull.Value)
                            productsModel.product_name = sdr["post_title"].ToString();
                        else
                            productsModel.product_name = string.Empty;

                  

                        _list.Add(productsModel);
                    }
                }
            }
            catch (Exception ex)
            { throw ex; }
            return _list;
        }


        public int Changestatus(OrderPostStatusModel model, string ID)
        {
            try
            {
                string strsql = string.Format("update wp_posts set post_status=@status,post_modified_gmt=@post_modified_gmt where id  in ({0}); ", ID);
                SqlParameter[] para =
                {
                    new SqlParameter("@status", model.status),
                   // new SqlParameter("@post_modified", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")),
                    new SqlParameter("@post_modified_gmt", DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss"))
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Product/Changestatus/" + "0" + "", "Update Product Status");
                throw Ex;
            }
        }

        public static List<ProductModelservices> GetProductParent(string strValue1, string strValue2)
        {
            List<ProductModelservices> _list = new List<ProductModelservices>();
            try
            {
                string free_products = string.Empty;

                ProductModelservices productsModel = new ProductModelservices();
                string strWhr = string.Empty;

                if (string.IsNullOrEmpty(strValue1) && string.IsNullOrEmpty(strValue2))
                {

                }
                else
                {
                    if (!string.IsNullOrEmpty(strValue1))
                        //    strWhr += " fk_product_fils = " + strValue1;
                        //string strSQl = "SELECT distinct wp.post_parent ID,wp.post_title,post_title title,qty"
                        //            + " FROM product_association p"
                        //            + "  left outer join wp_posts wp on wp.ID = p.fk_product"
                        //            + " WHERE " + strWhr;

                        //    strWhr += " fk_product_fils = " + strValue1;
                        //string strSQl = "SELECT distinct case when wp.post_parent = 0 then wp.ID else post_parent end ID,wp.post_title,post_title title,qty"
                        //            + " FROM product_association p"
                        //            + "  left outer join wp_posts wp on wp.ID = p.fk_product"
                        //            + " WHERE " + strWhr;

                        strWhr += " free_product_id = " + strValue1;
                    string strSQl = "SELECT distinct case when wp.post_parent = 0 then wp.ID else post_parent end ID,wp.post_title,post_title title,free_quantity qty"
                                + " FROM wp_product_free p"
                                + "  left outer join wp_posts wp on wp.ID = p.product_id"
                                + " WHERE " + strWhr;


                    strSQl += ";";
                    SqlDataReader sdr = SQLHelper.ExecuteReader(strSQl);
                    while (sdr.Read())
                    {
                        productsModel = new ProductModelservices();
                        if (sdr["ID"] != DBNull.Value)
                            productsModel.ID = Convert.ToInt64(sdr["ID"]);
                        else
                            productsModel.ID = 0;

                        productsModel.qty = Convert.ToInt32(sdr["qty"]);
                        productsModel.product_label = sdr["title"].ToString();
                        if (sdr["post_title"] != DBNull.Value)
                            productsModel.product_name = sdr["post_title"].ToString();
                        else
                            productsModel.product_name = string.Empty;

                        _list.Add(productsModel);
                    }
                }
            }
            catch (Exception ex)
            { throw ex; }
            return _list;
        }

        public static List<ProductByingPrice> GetBuyingdata(string strValue1, string strValue2)
        {
            List<ProductByingPrice> _list = new List<ProductByingPrice>();
            try
            {
                string free_products = string.Empty;

                ProductByingPrice productsModel = new ProductByingPrice();
                string strWhr = string.Empty;

                if (string.IsNullOrEmpty(strValue1) && string.IsNullOrEmpty(strValue2))
                {

                }
                else
                {
                    if (!string.IsNullOrEmpty(strValue1))
                        // strWhr += " fk_product = " + strValue1;
                        strWhr += " ppi.rowid in (SELECT max(rowid) id from Product_Purchase_Items WHERE fk_product = " + strValue1 + " group by fk_vendor) ";
                    string strSQl = "SELECT ppi.rowid,name,minpurchasequantity,Cast(CONVERT(DECIMAL(10,2),salestax) as nvarchar) salestax,Cast(CONVERT(DECIMAL(10,2),purchase_price) as nvarchar)  purchase_price, Cast(CONVERT(DECIMAL(10,2),cost_price) as nvarchar)  cost_price,  Cast(CONVERT(DECIMAL(10,2),shipping_price) as nvarchar) shipping_price,  Cast(CONVERT(DECIMAL(10,2),Misc_Costs) as nvarchar)  Misc_Costs, FORMAT(date_inc,'MM/dd/yyyy hh.mm') date_inc,FORMAT(date_to,'MM/dd/yyyy hh.mm') date_to,ppi.discount,taglotserialno,case when is_active = 1 then 'Active' else 'InActive' end as Status,is_setprise,fk_vendor,fk_product"
                            + " FROM Product_Purchase_Items ppi"
                            + " left outer JOIN wp_vendor wpv on wpv.rowid = ppi.fk_vendor"
                            + " WHERE" + strWhr;

                    strSQl += " order by rowid desc;";
                    SqlDataReader sdr = SQLHelper.ExecuteReader(strSQl);
                    while (sdr.Read())
                    {
                        productsModel = new ProductByingPrice();
                        if (sdr["rowid"] != DBNull.Value)
                            productsModel.ID = Convert.ToInt64(sdr["rowid"]);
                        else
                            productsModel.ID = 0;

                        productsModel.minpurchasequantity = sdr["minpurchasequantity"].ToString();
                        if (sdr["name"] != DBNull.Value)
                            productsModel.name = sdr["name"].ToString();
                        else
                            productsModel.name = string.Empty;
                        productsModel.salestax = sdr["salestax"].ToString();
                        productsModel.taglotserialno = sdr["taglotserialno"].ToString();
                        productsModel.purchase_price = sdr["purchase_price"].ToString();
                        productsModel.cost_price = sdr["cost_price"].ToString();
                        productsModel.shipping_price = sdr["shipping_price"].ToString();
                        productsModel.Misc_Costs = sdr["Misc_Costs"].ToString();
                        productsModel.date_inc = sdr["date_inc"].ToString();
                        productsModel.discount = sdr["discount"].ToString();
                        productsModel.Status = sdr["Status"].ToString();
                        productsModel.is_setprise = sdr["is_setprise"].ToString();
                        productsModel.date_to = sdr["date_to"].ToString();
                        productsModel.fk_vendor = sdr["fk_vendor"].ToString();
                        productsModel.fk_product = sdr["fk_product"].ToString();
                        _list.Add(productsModel);
                    }
                }
            }
            catch (Exception ex)
            { throw ex; }
            return _list;
        }

        public static DataTable GetPurchaseDataByID(OrderPostStatusModel model)
        {
            DataTable dt = new DataTable();

            try
            {
                string strWhr = string.Empty;

                string strSql = "SELECT P.ID ID,post_title,FORMAT(pmregularamount.meta_value,2)  regularamount,FORMAT(pmsaleprice.meta_value,2)"
                             + "  saleprice,pmmvirchual.meta_value  virchualValue,pmtotalsales.meta_value totalsales,pmtaxstatus.meta_value axstatus,pmtaxclass.meta_value taxclass,pmmanagestock.meta_value managestock,"
                             + "  pmbackorders.meta_value backorders,IFNULL(pmweight.meta_value,'0') weight,IFNULL(pmlength.meta_value,'0') length,IFNULL(pmeheight.meta_value,'0') height,IFNULL(pmwidth.meta_value,'0') width, pmstock.meta_value stock,pmstockstatus.meta_value stockstatus,pmsku.meta_value sku, (select term_id from wp_terms"
                             + "  where term_id in ( select term_id from wp_term_taxonomy where taxonomy = 'product_shipping_class' and term_taxonomy_id in (SELECT term_taxonomy_id FROM `wp_term_relationships` where object_id = P.ID))) shippingclass"
                             + " FROM wp_posts P"
                             + " left join wp_postmeta pmregularamount on P.ID = pmregularamount.post_id and pmregularamount.meta_key = '_regular_price'"
                             + " left join wp_postmeta pmsaleprice on P.ID = pmsaleprice.post_id and pmsaleprice.meta_key = '_sale_price'"
                             + " left join wp_postmeta pmtotalsales on P.ID = pmtotalsales.post_id and pmtotalsales.meta_key = 'total_sales'"
                             + " left join wp_postmeta pmtaxstatus on P.ID = pmtaxstatus.post_id and pmtaxstatus.meta_key = '_tax_status'"
                             + " left join wp_postmeta pmtaxclass on P.ID = pmtaxclass.post_id and pmtaxclass.meta_key = '_tax_class'"
                             + " left join wp_postmeta pmmanagestock on P.ID = pmmanagestock.post_id and pmmanagestock.meta_key = '_manage_stock'"
                             + " left join wp_postmeta pmmvirchual on P.ID = pmmvirchual.post_id and pmmvirchual.meta_key = '_virtual'"
                             + " left join wp_postmeta pmbackorders on P.ID = pmbackorders.post_id and pmbackorders.meta_key = '_backorders'"
                             + " left join wp_postmeta pmweight on P.ID = pmweight.post_id and pmweight.meta_key = '_weight'"
                             + " left join wp_postmeta pmlength on P.ID = pmlength.post_id and pmlength.meta_key = '_length'"
                             + " left join wp_postmeta pmwidth on P.ID = pmwidth.post_id and pmwidth.meta_key = '_width'"
                             + " left join wp_postmeta pmeheight on P.ID = pmeheight.post_id and pmeheight.meta_key = '_height'"
                             + " left join wp_postmeta pmstock on P.ID = pmstock.post_id and pmstock.meta_key = '_stock'"
                             + " left join wp_postmeta pmstockstatus on P.ID = pmstockstatus.post_id and pmstockstatus.meta_key = '_stock_status'"
                             + " left join wp_postmeta pmsku on P.ID = pmsku.post_id and pmsku.meta_key = '_sku'"
                             + " WHERE P.ID = " + model.strVal + " ";


                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dt = ds.Tables[0];

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataTable GetPurchaseDetailsDataByID(OrderPostStatusModel model)
        {
            DataTable dt = new DataTable();

            try
            {
                string strWhr = string.Empty;
                SqlParameter[] para = { new SqlParameter("@strVal", model.strVal), };
                string strSql = "erp_getpurchasedetailsbyID";

                DataSet ds = SQLHelper.ExecuteDataSet(strSql, para);
                dt = ds.Tables[0];

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static DataTable GetDataVariationByID(OrderPostStatusModel model)
        {
            DataTable dt = new DataTable();

            try
            {
                string strWhr = string.Empty;
                SqlParameter[] para = { new SqlParameter("@strVal", model.strVal), };
                string strSql = "erp_getvariationdetailsbyid";

                DataSet ds = SQLHelper.ExecuteDataSet(strSql, para);
                dt = ds.Tables[0];

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static string GetProductAttributeID(OrderPostStatusModel model)
        {
            string caregory = string.Empty;

            try
            {
                string strWhr = string.Empty;

                string strSql = "select meta_value productattributes FROM `wp_postmeta` where meta_key = '_product_attributes' and post_id = " + model.strVal + " ";


                caregory = SQLHelper.ExecuteScalar(strSql).ToString();
                //dt = ds.Tables[0];


            }
            catch (Exception ex)
            {
                throw ex;
            }
            return caregory;
        }
        public static DataTable GetProductcategoriesList_Old()
        {
            DataTable DT = new DataTable();
            try
            {
                string strSQl = "Select * From wp_terms Left Join wp_term_taxonomy On wp_terms.term_id = wp_term_taxonomy.term_id"
                              + " WHERE wp_term_taxonomy.taxonomy = 'product_cat' ";
                DT = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }
        public static DataTable GetProductcategoriesList()
        {
            DataTable DT = new DataTable();
            try
            {
                //string strSQl = "Select t.term_id, name,tm.meta_value from wp_terms t left join wp_term_taxonomy tx on t.term_id = tx.term_id"
                //              + " left join wp_termmeta tm on t.term_id = tm.term_id and tm.meta_key = 'Is_Active' where coalesce(tm.meta_value,'1') = '1' and tx.taxonomy = 'product_cat'; ";
                //DT = SQLHelper.ExecuteDataTable(strSQl);

                string strSQl = "Select tx.term_taxonomy_id term_id, if(tx.parent=0,t.name,concat('- ',t.name)) name,tx.parent  from wp_terms t left join wp_term_taxonomy tx on tx.term_id = t.term_id left join wp_termmeta tm_a on tm_a.term_id = t.term_id  and tm_a.meta_key = 'Is_Active' where taxonomy = 'product_cat' and coalesce(tm_a.meta_value,'1') = '1' "
                             + "  and 1 = 1 order by CASE WHEN tx.parent = 0 THEN tx.term_taxonomy_id ELSE tx.parent END DESC, CASE WHEN tx.parent = tx.term_taxonomy_id  THEN tx.parent ELSE tx.parent END ASC; ";
                DT = SQLHelper.ExecuteDataTable(strSQl);


            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }

        public static DataTable GetVender()
        {
            DataTable DT = new DataTable();
            try
            {
                string strSQl = "Select rowid,name from wp_vendor";
                DT = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }
        public static DataTable GetShipping()
        {
            DataTable DT = new DataTable();
            try
            {
                string strSQl = "Select id rowid,Shippingclass_Name name from Shipping_class";
                DT = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }
        public int CheckDuplicateShipping(ProductModel model)
        {
            try
            {
                string strquery = "select count(Shippingclass_Name) from Shipping_class where Shippingclass_Name = '" + model.Shippingclass_Name + "' ";
                SqlParameter[] para =
                {

                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strquery).ToString());
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public int AddNewShipping(ProductModel model)
        {
            try
            {
                string strsql = "insert into Shipping_class(Shippingclass_Name)values(@Shippingclass_Name);Select SCOPE_IDENTITY();";
                SqlParameter[] para =
                {
                    new SqlParameter("@Shippingclass_Name", model.Shippingclass_Name),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Product/NewShipping/" + model.ID + "", "Add new Shipping class");
                throw Ex;
            }
        }

        public int deleteShippingprice(ProductModel model)
        {
            try
            {
                string strsql = "delete from ShippingClass_Details where  fk_ShippingID = " + model.fk_ShippingID + " and countrycode = '" + model.countrycode + "' ";

                int result = SQLHelper.ExecuteNonQuery(strsql.ToString());
                return result;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Product/deleteShippingprice/" + model.ID + "", "Delete shipping class");
                throw Ex;
            }
        }
        public static DataTable Getsate(string Country)
        {
            DataTable DT = new DataTable();
            try
            {
                string strSQl = "Select StateFullName,State from erp_StateList where Country = '" + Country + "' ";
                DT = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }
        public static DataTable GetStateData(string strSearch, string country)
        {
            DataTable DT = new DataTable();
            try
            {

                DT = SQLHelper.ExecuteDataTable("select distinct StateFullName,State from erp_StateList where Country = '" + country + "' and  (StateFullName like '" + strSearch + "%' or State like '" + strSearch + "%') order by StateFullName;");

            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }
        public static DataTable SelectedStateData(string country)
        {
            DataTable DT = new DataTable();
            try
            {

                DT = SQLHelper.ExecuteDataTable("select distinct StateFullName,State from erp_StateList where Country = '" + country + "'  order by StateFullName;");

            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }

        public static DataTable GetCountryStateData(string strSearch, string country)
        {
            DataTable DT = new DataTable();
            try
            {

                DT = SQLHelper.ExecuteDataTable("select distinct Country,StateFullName,TRIM(State) State from erp_StateList  order by Country limit 50;");

            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }

        public static DataTable Getwarehouse()
        {
            DataTable DT = new DataTable();
            try
            {
                string strSQl = "Select rowid,ref from wp_warehouse where status = 1";
                DT = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }
        public static List<ProductModelservices> GetwarehouseData(string strValue1, string strValue2)
        {
            List<ProductModelservices> _list = new List<ProductModelservices>();
            try
            {
                string free_products = string.Empty;

                ProductModelservices productsModel = new ProductModelservices();
                string strWhr = string.Empty;

                if (string.IsNullOrEmpty(strValue1) && string.IsNullOrEmpty(strValue2))
                {

                }
                else
                {
                    if (!string.IsNullOrEmpty(strValue1))
                        strWhr += " fk_product = " + strValue1;
                    string strSQl = "SELECT post_title,pw.rowid as ID,fk_product,fk_warehouse ,ref warehouse,case when is_active = 1 then 'Active' else 'InActive' end as Status"
                                + " from product_warehouse pw"
                                + " Left outer join wp_warehouse on wp_warehouse.rowid = pw.fk_warehouse"
                                 + " Left outer join wp_posts on wp_posts.ID = pw.fk_product"
                                + " WHERE " + strWhr;

                    strSQl += ";";
                    SqlDataReader sdr = SQLHelper.ExecuteReader(strSQl);
                    while (sdr.Read())
                    {
                        productsModel = new ProductModelservices();
                        if (sdr["ID"] != DBNull.Value)
                            productsModel.ID = Convert.ToInt64(sdr["ID"]);
                        else
                            productsModel.ID = 0;
                        if (sdr["post_title"] != DBNull.Value)
                            productsModel.product_name = sdr["post_title"].ToString();
                        else
                            productsModel.product_name = string.Empty;

                        if (sdr["warehouse"] != DBNull.Value)
                            productsModel.product_label = sdr["warehouse"].ToString();
                        else
                            productsModel.product_label = string.Empty;

                        productsModel.Stock = sdr["Status"].ToString();

                        _list.Add(productsModel);
                    }
                }
            }
            catch (Exception ex)
            { throw ex; }
            return _list;
        }

        public static List<ProductModelservices> GetfileuploadData(string strValue1, string strValue2)
        {
            List<ProductModelservices> _list = new List<ProductModelservices>();
            try
            {
                string free_products = string.Empty;

                ProductModelservices productsModel = new ProductModelservices();
                string strWhr = string.Empty;

                if (string.IsNullOrEmpty(strValue1) && string.IsNullOrEmpty(strValue2))
                {

                }
                else
                {
                    if (!string.IsNullOrEmpty(strValue1))
                        strWhr += " fk_product = " + strValue1;
                    string strSQl = "SELECT pw.rowid as ID,fk_product,Length,FileType,FORMAT(CreateDate,'MM/dd/yyyy') CreateDate,FileName"
                                + " from product_linkedfiles pw"
                                + " WHERE " + strWhr;

                    strSQl += ";";
                    SqlDataReader sdr = SQLHelper.ExecuteReader(strSQl);
                    while (sdr.Read())
                    {
                        productsModel = new ProductModelservices();
                        if (sdr["ID"] != DBNull.Value)
                            productsModel.ID = Convert.ToInt64(sdr["ID"]);
                        else
                            productsModel.ID = 0;
                        if (sdr["FileName"] != DBNull.Value)
                            productsModel.product_name = sdr["FileName"].ToString();
                        else
                            productsModel.product_name = string.Empty;

                        productsModel.product_label = sdr["Length"].ToString();
                        productsModel.sellingpric = sdr["CreateDate"].ToString();

                        _list.Add(productsModel);
                    }
                }
            }
            catch (Exception ex)
            { throw ex; }
            return _list;
        }
        public static DataTable GetProductVariant(int ProductID)
        {
            DataTable dtr = new DataTable();
            try
            {
                string strquery = "SELECT ID,Post_title FROM wp_posts WHERE post_status = 'publish' and post_parent = " + ProductID + "";
                dtr = SQLHelper.ExecuteDataTable(strquery);
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }
        public static DataTable GetList(string strValue1, string userstatus, string strValue3, string strValue4, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "order_id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;
                if (strValue1 == "0")
                    strValue1 = "";
                if (strValue3 == "0")
                    strValue3 = "";
                if (strValue4 == "0")
                    strValue4 = "";

                if (!string.IsNullOrEmpty(userstatus))
                {
                    if (userstatus == "private")
                        strWhr += " and p.post_status in ('publish','private')";
                    else
                        strWhr += " and p.post_status = '" + userstatus + "'";
                }
                //else
                //    strWhr += " and p.post_status != 'auto-draft' ";
                //if (userstatus != "trash")
                //{
                //    strWhr += " and p.post_status != 'draft' ";
                //}
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (p.ID like '%" + searchid + "%' "
                            + " OR post_title like '%" + searchid + "%' "
                            //+ " OR itemname like '%" + searchid + "%' "
                            + " OR s.meta_value like '%" + searchid + "%' "
                            + " OR p.post_status like '%" + searchid + "%' "
                            //+ " OR pm1.meta_value like '%" + searchid + "%' "
                            //+ " OR pmstc.meta_value like '%" + searchid + "%' "


                            + " )";
                }
                if (!string.IsNullOrEmpty(strValue1))
                {

                    strWhr += " and (case when p.post_parent = 0 then p.id else p.post_parent end) in (select object_id from wp_term_relationships ttr where ttr.term_taxonomy_id='" + strValue1 + "')";
                }
                if (!string.IsNullOrEmpty(strValue3))
                {

                    strWhr += " and product_slug like '%" + strValue3 + "%' ";
                }
                if (!string.IsNullOrEmpty(strValue4))
                {

                    strWhr += " and pmstc.meta_value like '%" + strValue4 + "%' ";
                }
                //string strSql = "SELECT  p.ID,t.term_id, p.post_title, `post_excerpt`, t.name AS product_category, t.term_id AS product_id,t.slug AS product_slug,tt.term_taxonomy_id AS tt_term_taxonomia, "
                //                + " tr.term_taxonomy_id AS tr_term_taxonomia, p.post_status,post_date_gmt,CONCAT(p.post_status, ' ', post_date_gmt) Date,'*' Star, IFNULL(CONCAT(Min(CASE WHEN pm1.meta_key = '_price' then CONCAT('$', pm1.meta_value) ELSE NULL END), '-', MAX(CASE WHEN pm1.meta_key = '_price' then CONCAT('$', pm1.meta_value) ELSE NULL END)), '$0.00') price,"
                //                + " MAX(CASE WHEN pm1.meta_key = '_sku' then pm1.meta_value ELSE NULL END) as sku , pmstc.meta_value stockstatus"
                //                  + " FROM wp_posts p"
                //                  + " LEFT JOIN wp_postmeta pm1 ON pm1.post_id = p.ID"
                //                  + " LEFT JOIN wp_postmeta pmstc ON pmstc.post_id = p.ID and pmstc.meta_key = '_stock_status'"
                //                  + " LEFT JOIN wp_term_relationships AS tr ON tr.object_id = p.ID"
                //                  + " JOIN wp_term_taxonomy AS tt ON tt.term_taxonomy_id = tr.term_taxonomy_id and tt.taxonomy IN('product_cat','product_type')"
                //                  + " JOIN wp_terms AS t ON t.term_id = tt.term_id"
                //                  + " WHERE p.post_type in('product') " + strWhr 
                //                  + " GROUP BY p.ID"
                //                  + " order by " + SortCol + " " + SortDir + " limit " + (pageno).ToString() + ", " + pagesize + "";

                //////string strSql = "SELECT  p.ID,t.term_id, p.post_title, t.name AS product_category,p.post_status,post_date_gmt,DATE_FORMAT(p.post_date_gmt, '%M %d %Y') Date,DATE_FORMAT(p.post_modified, '%M %d %Y') publishDate"
                //////+ " ,'*' Star, case when p.post_status = 'trash' then 'InActive' else 'Active' end Activestatus , group_concat(distinct t.term_id) namecategoty,case when LOCATE(4, (group_concat(distinct t.term_id))) > 0  then 'yes' else 'no' end pricecodition,"
                //////+ " case when LOCATE(4, (group_concat(distinct t.term_id))) > 0  then (IFNULL(CONCAT(Min(CASE WHEN pm1.meta_key = '_price' then CONCAT('$', pm1.meta_value) ELSE NULL END), '-', MAX(CASE WHEN pm1.meta_key = '_price' then CONCAT('$', pm1.meta_value) ELSE NULL END)), '$0.00')) else CONCAT('$', pmreg.meta_value, '-', '$', pmsalpr.meta_value) end price,"
                //////+ " MAX(CASE WHEN pm1.meta_key = '_sku' then pm1.meta_value ELSE NULL END) as sku , pmstc.meta_value stockstatus,"
                //////+ " (select group_concat(ui.name) from wp_terms ui join wp_term_taxonomy uim on uim.term_id = ui.term_id and uim.taxonomy IN('product_cat') JOIN wp_term_relationships AS trp ON trp.object_id = p.ID and trp.term_taxonomy_id = uim.term_taxonomy_id) itemname"
                //////+ " ,pmreg.meta_value Regprice,pmsalpr.meta_value SalPrice"
                //////+ " FROM wp_posts p"
                //////+ " LEFT JOIN wp_postmeta pm1 ON pm1.post_id = p.ID"
                //////+ " LEFT JOIN wp_postmeta pmreg ON pmreg.post_id = p.ID  and pmreg.meta_key = '_regular_price'"
                //////+ " LEFT JOIN wp_postmeta pmsalpr ON pmsalpr.post_id = p.ID  and pmsalpr.meta_key= '_sale_price'"
                //////+ " LEFT JOIN wp_postmeta pmstc ON pmstc.post_id = p.ID and pmstc.meta_key = '_stock_status'"
                //////+ " LEFT JOIN wp_term_relationships AS tr ON tr.object_id = p.ID"
                //////+ " LEFT JOIN wp_term_taxonomy AS tt ON tt.term_taxonomy_id = tr.term_taxonomy_id"
                //////+ " JOIN wp_terms AS t ON t.term_id = tt.term_id"
                //////+ " WHERE p.post_type in('product') and p.post_status != 'draft' and tt.taxonomy IN('product_cat','product_type') " + strWhr
                //////+ " GROUP BY p.ID"
                //////+ " order by " + SortCol + " " + SortDir + " limit " + (pageno).ToString() + ", " + pagesize + "";

                //////strSql += "; SELECT count(distinct p.ID) TotalRecord FROM wp_posts p"
                //////              + " LEFT JOIN wp_postmeta pm1 ON pm1.post_id = p.ID"
                //////+ " LEFT JOIN wp_postmeta pmreg ON pmreg.post_id = p.ID  and pmreg.meta_key = '_regular_price'"
                //////+ " LEFT JOIN wp_postmeta pmsalpr ON pmsalpr.post_id = p.ID  and pmsalpr.meta_key= '_sale_price'"
                //////+ " LEFT JOIN wp_postmeta pmstc ON pmstc.post_id = p.ID and pmstc.meta_key = '_stock_status'"
                //////+ " LEFT JOIN wp_term_relationships AS tr ON tr.object_id = p.ID"
                //////+ " LEFT JOIN wp_term_taxonomy AS tt ON tt.term_taxonomy_id = tr.term_taxonomy_id"
                //////+ " JOIN wp_terms AS t ON t.term_id = tt.term_id"
                //////+ " WHERE p.post_type in('product') and p.post_status != 'draft' and tt.taxonomy IN('product_cat','product_type') " + strWhr;


                string strSql = "select max(t.term_id) term_id,p.id,max(p.post_type)post_type,max(p.post_title)post_title,max(post_date_gmt)post_date_gmt, CONVERT(VARCHAR(12), max(p.post_date_gmt), 107) Date,  CONVERT(VARCHAR(12), max(p.post_modified), 107) publishDate ,isnull(thumbnails,'default.png') thumbnails,"
              + " (select string_agg(ui.name,',') from wp_terms ui join wp_term_taxonomy uim on uim.term_id = ui.term_id and uim.taxonomy IN('product_cat') JOIN wp_term_relationships AS trp ON trp.object_id = p.ID and trp.term_taxonomy_id = uim.term_taxonomy_id) itemname , "
             // + " STUFF((SELECT ',' + ui.name FROM dbo.wp_terms ui join wp_term_taxonomy uim on uim.term_id = ui.term_id and uim.taxonomy IN('product_cat') JOIN wp_term_relationships AS trp ON trp.object_id = p.ID and trp.term_taxonomy_id = uim.term_taxonomy_id FOR XML PATH('')), 1, 1, '') as metadetails, "
              + " case when p.post_status = 'trash' then 'InActive' else 'Active' end Activestatus,max(case when p.id = s.post_id and s.meta_key = '_sku' then s.meta_value else '' end) sku,"
              + " max(case when p.id = s.post_id and s.meta_key = '_regular_price' then s.meta_value else '' end) regular_price,(select count(product_id) from wp_product_free where product_id = p.ID and status =1 and product_type_id = 3 ) component_status, "
              + " max(case when p.id = s.post_id and s.meta_key = '_sale_price' then s.meta_value else '' end) sale_price, (case when p.post_parent = 0 then p.id else p.post_parent end) p_id,p.post_parent,p.post_status"
              + " FROM wp_posts p "
              + " left join wp_postmeta as s on p.id = s.post_id"
              + " LEFT JOIN wp_term_relationships AS tr ON tr.object_id = p.ID"
              + " LEFT JOIN wp_term_taxonomy AS tt ON tt.term_taxonomy_id = tr.term_taxonomy_id and taxonomy IN('product_type')"
              + " LEFT JOIN wp_terms AS t ON t.term_id = tt.term_id"
               + " left join wp_image wpimg on wpimg.id = p.ID"
              + " WHERE p.post_type in ('product', 'product_variation') and p.post_status != 'draft' " + strWhr
              + " GROUP BY p.ID,guid,thumbnails,post_status,post_parent"
               + " order by p_id,post_type,p.id";
                //+ " order by p_id" + " limit " + (pageno).ToString() + ", " + pagesize + "";

                strSql += "; SELECT count(distinct p.ID) TotalRecord FROM wp_posts p"
               + " left join wp_postmeta as s on p.id = s.post_id"
              + " LEFT JOIN wp_term_relationships AS tr ON tr.object_id = p.ID"
              + " LEFT JOIN wp_term_taxonomy AS tt ON tt.term_taxonomy_id = tr.term_taxonomy_id"
              + " LEFT JOIN wp_terms AS t ON t.term_id = tt.term_id"
              + " left join wp_image wpimg on wpimg.id = p.ID"
              + " WHERE p.post_type in ('product', 'product_variation') and p.post_status != 'draft' " + strWhr;



                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dt = ds.Tables[0];
                if (ds.Tables[1].Rows.Count > 0)
                    totalrows = Convert.ToInt32(ds.Tables[1].Rows[0]["TotalRecord"].ToString());
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }


        public static DataTable Getcalculatemargins(string strValue1, string userstatus, string strValue3, string strValue4, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "order_id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;

                //  string strSql = "Select *,convert(numeric(18,2),sale_price) - convert(numeric(18,2),cost_price) Margins from ("
                //+ " select p.id,max(p.post_type)post_type,max(p.post_title)post_title,"
                //+ " max(case when p.id = s.post_id and s.meta_key = '_sku' then s.meta_value else '' end) sku,"
                //+ " max(case when p.id = s.post_id and s.meta_key = '_sale_price' then coalesce (s.meta_value,'0') else '0' end) sale_price,"
                //+ " (case when p.post_parent = 0 then p.id else p.post_parent end) p_id,p.post_parent,p.post_status,Cast(CONVERT(DECIMAL(10,2),coalesce(min(cost_price),0)) as nvarchar) cost_price, (select name from wp_vendor where rowid = (select top 1 fk_vendor from Product_Purchase_Items where fk_product = p.id and  is_setprise = 1 ))  vname"
                //+ " FROM wp_posts p "
                //+ " left join wp_postmeta as s on p.id = s.post_id"
                //+ " left join Product_Purchase_Items on Product_Purchase_Items.fk_product = p.id and is_active=1 and is_setprise = 1"
                //+ " WHERE p.post_type in ('product', 'product_variation') and p.post_status != 'draft' " 
                //+ " GROUP BY  p.ID,guid,post_status,post_parent) tt"
                // + " order by p_id,post_type,id";

                string strSql = "Select TOP 3000 *, cast(sale_price as numeric(18,2)) - cast(cast_prise as numeric(18,2)) Margin,cast(regula_price as numeric(18,2)) - cast(cast_prise as numeric(18,2)) regulaMargin,coalesce(convert(numeric(18,2),( ((cast(sale_price as numeric(18,2)) - cast(cast_prise as numeric(18,2))) * 100) / NULLIF(cast(sale_price as numeric(18,2)),0))),0) marginpersantage,coalesce(convert(numeric(18,2),( ((cast(regula_price as numeric(18,2)) - cast(cast_prise as numeric(18,2))) * 100) / NULLIF(cast(regula_price as numeric(18,2)),0))),0) regularmarginpersantage "
              + " from ( select p.id,max(p.post_type)post_type,max(p.post_title)post_title,"
              + " max(case when p.id = s.post_id and s.meta_key = '_sku' then s.meta_value else '' end) sku,"
              + " max(case when p.id = s.post_id and s.meta_key = '_price' then s.meta_value else '0' end) sale_price,max(case when p.id = s.post_id and s.meta_key = '_regular_price' and s.meta_value != 'undefined' then s.meta_value else '0' end) regula_price, "
              + " (case when p.post_parent = 0 then p.id else p.post_parent end) p_id,p.post_parent,p.post_status,coalesce(convert(numeric(18,2),max(cost_price)),0) cast_prise,(select name from wp_vendor where rowid = (select top 1 fk_vendor from Product_Purchase_Items where fk_product = p.id and is_setprise = 1)) vname"
              + " FROM wp_posts p "
              + " left join wp_postmeta as s on p.id = s.post_id and s.meta_key in ('_sku','_price','_regular_price')"
              + " left join Product_Purchase_Items on Product_Purchase_Items.fk_product = p.id and is_active=1 and is_setprise = 1"
              + " WHERE p.post_type in ('product', 'product_variation') and p.post_status != 'draft' "
              + " GROUP BY  p.ID,guid,post_status,post_parent) tt"
               + " order by p_id,post_type,id";


                strSql += "; SELECT count(distinct p.ID) TotalRecord FROM wp_posts p"
               + " left join wp_postmeta as s on p.id = s.post_id" 
              + " WHERE p.post_type in ('product', 'product_variation') and p.post_status != 'draft' " ;

                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dt = ds.Tables[0];
                if (ds.Tables[1].Rows.Count > 0)
                    totalrows = Convert.ToInt32(ds.Tables[1].Rows[0]["TotalRecord"].ToString());
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }



        public static DataTable GetShippinfclassList(string strValue1, string userstatus, string strValue3, string strValue4, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "order_id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;

                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (rowid like '%" + searchid + "%' "
                            + " OR Shippingclass_Name like '%" + searchid + "%' "
                            + " OR eslcun.CountryFullName like '%" + searchid + "%' "
                            + " OR esl.StateFullName like '%" + searchid + "%' "
                            + " OR Shipping_price like '%" + searchid + "%' "
                            + " OR taxable like '%" + searchid + "%' "
                            + " )";
                }

                string strSql = "select DISTINCT rowid, Shippingclass_Name ShipName,eslcun.CountryFullName Country,esl.StateFullName"
                + " State,Method, Cast(CONVERT(DECIMAL(10,2),Shipping_price) as nvarchar) Shipping_price ,Type,taxable"
                + " from ShippingClass_Details ScD"
                + " left OUTER join Shipping_class sc on sc.id = ScD.fk_ShippingID"
                + " left OUTER join erp_StateList esl on esl.State = ScD.statecode"
                + " left OUTER join erp_StateList eslcun on eslcun.Country = ScD.countrycode"
                + " WHERE rowid > 0" + strWhr

              //  string strSql = "select DISTINCT fk_Shippingid, Shippingclass_Name ShipName,eslcun.CountryFullName Country,Method,format(Shipping_price,2) Shipping_price"
              //+ " ,Type,taxable ,(select group_concat(esl.StateFullName) from erp_StateList esl where esl.State = esl.State group by  Shipping_price) State"
              //+ " from ShippingClass_Details ScD"
              //+ " left OUTER join Shipping_class sc on sc.id = ScD.fk_ShippingID"
              // + " left OUTER join Shipping_class sc on sc.id = ScD.fk_ShippingID"
              //+ " left OUTER join erp_StateList eslcun on eslcun.Country = ScD.countrycode"
              //+ " WHERE rowid > 0" + strWhr

              //+ " order by " + SortCol + " " + SortDir + " limit " + (pageno).ToString() + ", " + pagesize + "";


                + " order by " + SortCol + " " + SortDir + " OFFSET " + (pageno).ToString() + " ROWS FETCH NEXT " + pagesize + " ROWS ONLY; " ;

                strSql += "; SELECT count(distinct rowid) TotalRecord from ShippingClass_Details ScD"
                + " left OUTER join Shipping_class sc on sc.id = ScD.fk_ShippingID"
                + " left OUTER join erp_StateList esl on esl.State = ScD.statecode"
                + " left OUTER join erp_StateList eslcun on eslcun.Country = ScD.countrycode"
                + " WHERE rowid > 0" + strWhr.ToString();
                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dt = ds.Tables[0];
                if (ds.Tables[1].Rows.Count > 0)
                    totalrows = Convert.ToInt32(ds.Tables[1].Rows[0]["TotalRecord"].ToString());
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static DataTable GetProducts(string strSearch)
        {
            DataTable DT = new DataTable();
            try
            {
                string strSQl = "select p.id, CONCAT(p.post_title,'(',MAX(CASE WHEN pm1.meta_key = '_sku' then pm1.meta_value else null end) , ')') as Name"
                            + " FROM wp_posts p LEFT JOIN wp_postmeta pm1 ON pm1.post_id = p.ID and pm1.meta_key = '_sku'"
                            + " WHERE p.post_type in('product') and pm1.meta_value is not NULL and CONCAT(p.post_title, pm1.meta_value) like '%" + strSearch + "%' "
                            + " GROUP BY p.ID,post_title";
                DT = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }


        public static int AddProducts(ProductModel model)
        {
            try
            {
                DataTable dt = new DataTable();
                string strsql = "";
                SqlParameter[] para =
                {
                    new SqlParameter("@qflag", "IA"),
                    new SqlParameter("@post_date", DateTime.Now),
                    new SqlParameter("@post_date_gmt", DateTime.UtcNow),
                    new SqlParameter("@post_content", model.post_content),
                    new SqlParameter("@post_excerpt", string.Empty),
                    new SqlParameter("@post_title", model.post_title),
                    new SqlParameter("@post_status", model.post_status),
                    new SqlParameter("@post_type", model.post_type),
                    new SqlParameter("@post_name", model.post_name),
                    new SqlParameter("@to_ping", string.Empty),
                    new SqlParameter("@pinged", string.Empty),
                    new SqlParameter("@post_content_filtered", string.Empty),
                    new SqlParameter("@post_mime_type", string.Empty),
                    new SqlParameter("@post_parent", model.post_parent),
                    new SqlParameter("@comment_status", model.comment_status),
                };
                dt = SQLHelper.ExecuteDataTable("erp_product_iud", para);
                int result = Convert.ToInt32(dt.Rows[0]["id"]);
                //int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Product/saveAttributes/" + model.ID + "", "Create New Attributes");
                throw Ex;
            }
        }
        public static int AddProductDetails(ProductModel model)
        {
            try
            {
                DataTable dt = new DataTable();
                
                SqlParameter[] para =
                {
                     new SqlParameter("@qflag", "I"),
                    new SqlParameter("@post_date", DateTime.Now),
                    new SqlParameter("@post_date_gmt", DateTime.UtcNow),
                    new SqlParameter("@post_content", model.post_content),
                    new SqlParameter("@post_excerpt", string.Empty),
                    new SqlParameter("@post_title", model.post_title),
                    new SqlParameter("@post_status", model.post_status),
                    new SqlParameter("@post_type", model.post_type),
                    new SqlParameter("@post_name", model.post_name),
                    new SqlParameter("@to_ping", string.Empty),
                    new SqlParameter("@pinged", string.Empty),
                    new SqlParameter("@post_content_filtered", string.Empty),
                    new SqlParameter("@post_mime_type", string.Empty),
                    new SqlParameter("@post_parent", model.post_parent),
                    new SqlParameter("@comment_status", model.comment_status),
                    new SqlParameter("@post_modified",model.PublishDate),
                    new SqlParameter("@product_typeid",model.ProductTypeID),

                };
                dt = SQLHelper.ExecuteDataTable("erp_product_iud", para);
                int result = Convert.ToInt32(dt.Rows[0]["id"]);
                //int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Product/CreateProduct/" + model.ID + "", "Create New Product");
                throw Ex;
            }
        }

        public static int Addshippingdetails(ProductModel model)
        {
            try
            {
                string strsql = "Insert into Shipping_class(Shippingclass_Name) values(@Shippingclass_Name);SELECT LAST_INSERT_ID();";
                SqlParameter[] para =
                {
                    new SqlParameter("@Shippingclass_Name", model.Shippingclass_Name),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static int FileUploade(int fk_product, string FileName, string Length, string FileType, string FilePath)
        {
            int result = 0;
            try
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append(string.Format("Insert into product_linkedfiles(fk_product,FileName,Length,FileType,FilePath) values(" + fk_product + ",'" + FileName + "','" + Length + "','" + FileType + "','" + FilePath + "');"));
                result = SQLHelper.ExecuteNonQuery(strSql.ToString());
                return result;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Product/FileUploade/" + fk_product + "", "Uploade product linked files");
                throw Ex;
            }
        }
        public static int EditProducts(ProductModel model, long ID)
        {
            try
            {
                string strsql = "erp_product_iud";
                SqlParameter[] para =
                {
                    new SqlParameter("@qflag", "U"),
                    new SqlParameter("@id", ID),
                    new SqlParameter("@post_content", model.post_content),
                    new SqlParameter("@post_title", model.post_title),
                    new SqlParameter("@post_name", model.post_name),
                    new SqlParameter("@post_status", model.post_status),
                    new SqlParameter("@post_modified",model.PublishDate),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Product/CreateProduct/" + ID + "", "Product Update Details");
                throw Ex;
            }
        }

        public static int AddBuyingtProduct(ProductModel model, DateTime dateinc)
        {
           // int result = 0;
            try
            {
                StringBuilder strSql = new StringBuilder();
                //StringBuilder strSql = new StringBuilder(string.Format("delete from Product_Purchase_Items where fk_product = {0}; ", model.fk_product));
                ////  strSql.Append(string.Format("insert into Product_Purchase_Items ( fk_product,fk_vendor,purchase_price,cost_price,minpurchasequantity,salestax,taxrate,discount,remark,taglotserialno,shipping_price,Misc_Costs) values ({0},{1},{2},{3},{4},{5},{6},{7},'{8}','{9}',{10},{11}); ", model.fk_product, model.fk_vendor, model.purchase_price, model.cost_price, model.minpurchasequantity, model.salestax, model.taxrate, model.discount, model.remark, model.taglotserialno, model.shipping_price, model.Misc_Costs));
                //strSql.Append(string.Format("delete from product_warehouse where fk_product = {0}; ", model.fk_product));
                //strSql.Append(string.Format("update product_warehouse set is_active = 0 where fk_product = {0}; ", model.fk_product));
                // strSql.Append(string.Format("insert into product_warehouse(fk_product,fk_warehouse) (select '"+ model.fk_product + "',warehouseid from wp_VendorWarehouse where VendorID = "+ model.fk_vendor + ") "));
                /// step 6 : wp_posts
                //strSql.Append(string.Format(" update wp_posts set post_status = '{0}' ,comment_status = 'closed' where id = {1} ", model.OrderPostStatus.status, model.OrderPostStatus.order_id));

                //  result = SQLHelper.ExecuteNonQuery(strSql.ToString());
 
                string strsql = "erp_buyingtProduct_iud";
                SqlParameter[] para =
                {
                    new SqlParameter("@qflag", "I"),
                    new SqlParameter("@id", 0),
                    new SqlParameter("@fk_product", model.fk_product),
                    new SqlParameter("@fk_vendor", model.fk_vendor),
                    new SqlParameter("@purchase_price", model.purchase_price),
                    new SqlParameter("@cost_price",model.cost_price),
                    new SqlParameter("@minpurchasequantity",model.minpurchasequantity),
                    new SqlParameter("@salestax",model.salestax),
                    new SqlParameter("@taxrate",model.taxrate),
                    new SqlParameter("@discount",model.discount),
                    new SqlParameter("@remark",model.remark),
                    new SqlParameter("@taglotserialno",model.taglotserialno),
                    new SqlParameter("@shipping_price",model.shipping_price),
                    new SqlParameter("@Misc_Costs",model.Misc_Costs),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;

            }
            catch (Exception ex)
            {
                UserActivityLog.ExpectionErrorLog(ex, "Product/BuyingPrice/" + model.ID + "", "Add buying price");
                throw ex; }
             
        }

        public static int AddBuyingtProductwarehouse(ProductModel model, DateTime dateinc)
        {
            int result = 0;
            try
            {
                StringBuilder strSql = new StringBuilder();
                //StringBuilder strSql = new StringBuilder(string.Format("delete from Product_Purchase_Items where fk_product = {0}; ", model.fk_product));
                //strSql.Append(string.Format("insert into Product_Purchase_Items ( fk_product,fk_vendor,purchase_price,cost_price,minpurchasequantity,salestax,taxrate,discount,remark,taglotserialno,shipping_price) values ({0},{1},{2},{3},{4},{5},{6},{7},'{8}','{9}',{10}); ", model.fk_product, model.fk_vendor, model.purchase_price, model.cost_price, model.minpurchasequantity, model.salestax, model.taxrate, model.discount, model.remark, model.taglotserialno, model.shipping_price));
                //strSql.Append(string.Format("delete from product_warehouse where fk_product = {0}; ", model.fk_product));
                //strSql.Append(string.Format("update product_warehouse set is_active = 0 where fk_product = {0}; ", model.fk_product));
                strSql.Append(string.Format("insert into product_warehouse(fk_product,fk_warehouse) (select '" + model.fk_product + "',warehouseid from wp_VendorWarehouse where VendorID = " + model.fk_vendor + ") "));
                /// step 6 : wp_posts
                //strSql.Append(string.Format(" update wp_posts set post_status = '{0}' ,comment_status = 'closed' where id = {1} ", model.OrderPostStatus.status, model.OrderPostStatus.order_id));

                result = SQLHelper.ExecuteNonQuery(strSql.ToString());
            }
            catch (Exception ex)
            {
                UserActivityLog.ExpectionErrorLog(ex, "Product/BuyingPrice/" + model.ID + "", "Add product warehouse");
                throw ex; }
            return result;
        }

        public static int AddshippingPricedetails(ProductModel model)
        {
            int result = 0;
            try
            {
                StringBuilder strSql = new StringBuilder();
                //StringBuilder strSql = new StringBuilder(string.Format("delete from Product_Purchase_Items where fk_product = {0}; ", model.fk_product));
                strSql.Append(string.Format("insert into ShippingClass_Details (fk_ShippingID,countrycode,statecode,Method,Shipping_price,Type,taxable) values ({0},'{1}','{2}','{3}',{4},'{5}','{6}') ", model.fk_ShippingID, model.countrycode, model.statecode, model.Shipping_Method, model.Ship_price, model.Shipping_type, model.taxable));

                /// step 6 : wp_posts
                //strSql.Append(string.Format(" update wp_posts set post_status = '{0}' ,comment_status = 'closed' where id = {1} ", model.OrderPostStatus.status, model.OrderPostStatus.order_id));

                result = SQLHelper.ExecuteNonQuery(strSql.ToString());
            }
            catch (Exception ex)
            {
                UserActivityLog.ExpectionErrorLog(ex, "Product/CreateShipname/" + model.ID + "", "insert Shipping class details.");
                throw ex; 
            }
            return result;
        }

        public static int updateBuyingtProduct(ProductModel model, DateTime dateinc)
        {
            int result = 0;
            try
            {
                StringBuilder strSql = new StringBuilder();
                //StringBuilder strSql = new StringBuilder(string.Format("delete from Product_Purchase_Items where fk_product = {0}; ", model.fk_product));
                // strSql.Append(string.Format("insert into Product_Purchase_Items ( fk_vendor,purchase_price,cost_price,minpurchasequantity,salestax,taxrate,discount,remark) values ({0},{1},{2},{3},{4},{5},{6},{7},'{8}') ", model.fk_product, model.fk_vendor, model.purchase_price, model.cost_price, model.minpurchasequantity, model.salestax, model.taxrate, model.discount, model.remark));

                /// step 6 : wp_posts
                strSql.Append(string.Format("update Product_Purchase_Items set fk_vendor = {0} ,purchase_price = {1},cost_price = {2},minpurchasequantity = {3},salestax = {4},taxrate = {5},discount = {6},remark = '{7}',taglotserialno = '{8}',shipping_price = {9},Misc_Costs = {10} where rowid = {11} ;", model.fk_vendor, model.purchase_price, model.cost_price, model.minpurchasequantity, model.salestax, model.taxrate, model.discount, model.remark, model.taglotserialno, model.shipping_price, model.Misc_Costs, model.ID));
                //  strSql.Append(string.Format("delete from product_warehouse where fk_product = {0}; ", model.fk_product));
                // strSql.Append(string.Format("update product_warehouse set is_active = 0 where fk_product = {0}; ", model.fk_product));

                // strSql.Append(string.Format("insert into product_warehouse(fk_product,fk_warehouse) (select '" + model.fk_product + "',warehouseid from wp_VendorWarehouse where VendorID = " + model.fk_vendor + ") "));
                result = SQLHelper.ExecuteNonQuery(strSql.ToString());
            }
            catch (Exception ex)
            {
                UserActivityLog.ExpectionErrorLog(ex, "Product/BuyingPrice/" + model.ID + "", "Update buying price");
                throw ex; 
            }
            return result;
        }
        public static int updateshippingclass(ProductModel model)
        {
            int result = 0;
            try
            {
                StringBuilder strSql = new StringBuilder();
                //StringBuilder strSql = new StringBuilder(string.Format("delete from Product_Purchase_Items where fk_product = {0}; ", model.fk_product));
                // strSql.Append(string.Format("insert into Product_Purchase_Items ( fk_vendor,purchase_price,cost_price,minpurchasequantity,salestax,taxrate,discount,remark) values ({0},{1},{2},{3},{4},{5},{6},{7},'{8}') ", model.fk_product, model.fk_vendor, model.purchase_price, model.cost_price, model.minpurchasequantity, model.salestax, model.taxrate, model.discount, model.remark));

                /// step 6 : wp_posts
                strSql.Append(string.Format("update ShippingClass_Details set countrycode = '{0}' ,statecode = '{1}',Method = '{2}',Shipping_price = {3},Type = '{4}',taxable = '{5}',fk_ShippingID= {6} where rowid = {7} ", model.countrycode, model.statecode, model.Shipping_Method, model.Ship_price, model.Shipping_type, model.taxable, model.fk_ShippingID, model.ID));

                result = SQLHelper.ExecuteNonQuery(strSql.ToString());
            }
            catch (Exception ex)
            {
                UserActivityLog.ExpectionErrorLog(ex, "Product/CreateShipname/" + model.ID + "", "Update Shipping class details.");
                throw ex; 
            }
            return result;
        }
        public static int updateNotesProduct(ProductModel model)
        {
            int result = 0;
            try
            {
                string strSql_insert = string.Empty;
                StringBuilder strSql = new StringBuilder();
                //foreach (ProductModelMetaModel obj in model)
                //{
                strSql_insert += (strSql_insert.Length > 0 ? " union all " : "") + string.Format("select '{0}' post_id,'{1}' meta_key,'{2}' meta_value", model.ID, "Private_Notes", model.Private_Notes);
                strSql_insert += (strSql_insert.Length > 0 ? " union all " : "") + string.Format("select '{0}' post_id,'{1}' meta_key,'{2}' meta_value", model.ID, "Public_Notes", model.Public_Notes);
                strSql.Append(string.Format("update wp_postmeta set meta_value = '{0}' where post_id = '{1}' and meta_key = '{2}' ; ", model.Private_Notes, model.ID, "Private_Notes"));
                strSql.Append(string.Format("update wp_postmeta set meta_value = '{0}' where post_id = '{1}' and meta_key = '{2}' ; ", model.Public_Notes, model.ID, "Public_Notes"));
                //}
                strSql_insert = "insert into wp_postmeta (post_id,meta_key,meta_value) select * from (" + strSql_insert + ") as tmp where tmp.meta_key not in (select meta_key from wp_postmeta where post_id = " + model.ID.ToString() + ");";
                strSql.Append(strSql_insert);
                result = SQLHelper.ExecuteNonQueryWithTrans(strSql.ToString());
            }
            catch (Exception Ex) {
                UserActivityLog.ExpectionErrorLog(Ex, "Product/CreateNotes/" + model.ID + "", "Add note in add/edit product");
            }
            return result;
        }
        public static int DeleteBuyingtProduct(ProductModel model)
        {
            int result = 0;
            try
            {
                //StringBuilder strSql = new StringBuilder();
                // StringBuilder strSql = new StringBuilder(string.Format("delete from Product_Purchase_Items where rowid = {0}; ", model.ID));
                StringBuilder strSql = new StringBuilder(string.Format("update Product_Purchase_Items set is_active = 0 where rowid = {0};", model.ID));
                result = SQLHelper.ExecuteNonQuery(strSql.ToString());
            }
            catch (Exception ex)
            {
                UserActivityLog.ExpectionErrorLog(ex, "Product/DeleteBuyingPrice/" + model.ID + "", "Delete buying price");
                throw ex; }
            return result;
        }
        public static int SetBuyingPrice(ProductModel model)
        {
            int result = 0;
            try
            {
                //StringBuilder strSql = new StringBuilder();
              StringBuilder strSql = new StringBuilder(string.Format("update Product_Purchase_Items set is_setprise = 0 where fk_product = {0}; ", model.fk_product));
                strSql.Append(string.Format("update Product_Purchase_Items set is_setprise = 1 where rowid = {0};", model.ID));
            
                result = SQLHelper.ExecuteNonQuery(strSql.ToString());
            }
            catch (Exception ex)
            {
                UserActivityLog.ExpectionErrorLog(ex, "Product/SetBuyingPrice/" + model.ID + "", "Update setprise set for product");
                throw ex; }
            return result;
        }
        public static int ActiveuyingPrice(ProductModel model)
        {
            int result = 0;
            try
            {
                //StringBuilder strSql = new StringBuilder();
                // StringBuilder strSql = new StringBuilder(string.Format("delete from Product_Purchase_Items where rowid = {0}; ", model.ID));
                StringBuilder strSql = new StringBuilder(string.Format("update Product_Purchase_Items set is_active = 1 where rowid = {0};", model.ID));
                result = SQLHelper.ExecuteNonQuery(strSql.ToString());
            }
            catch (Exception ex)
            {
                UserActivityLog.ExpectionErrorLog(ex, "Product/UpdateChildvariations/" + model.ID + "", "Update product buying price active");
                throw ex; }
            return result;
        }

        public static int AddProductwarehouse(ProductModel model)
        {
            int result = 0;
            try
            {
                StringBuilder strSql = new StringBuilder();
                //StringBuilder strSql = new StringBuilder(string.Format("delete from Product_Purchase_Items where fk_product = {0}; ", model.fk_product));
                strSql.Append(string.Format("insert into product_warehouse(fk_product,fk_warehouse) values ({0},{1}) ", model.fk_product, model.fk_vendor));

                /// step 6 : wp_posts
                //strSql.Append(string.Format(" update wp_posts set post_status = '{0}' ,comment_status = 'closed' where id = {1} ", model.OrderPostStatus.status, model.OrderPostStatus.order_id));

                result = SQLHelper.ExecuteNonQuery(strSql.ToString());
            }
            catch (Exception ex)
            {
                UserActivityLog.ExpectionErrorLog(ex, "Product/Createwarehouse/" + model.ID + "", "Add warehouse to product");
                throw ex; }
            return result;
        }
        public static DataTable Getproductwarehouse(ProductModel model)
        {
            DataTable dt = new DataTable();
            try
            {
                string strSQl = "select fk_warehouse from product_warehouse"
                                + " WHERE fk_product = " + model.fk_product + " and fk_warehouse in (" + model.fk_vendor + ") "
                                + " ;";
                dt = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static DataTable GetproductPurchase_Items(ProductModel model)
        {
            DataTable dt = new DataTable();
            try
            {
                string strSQl = "select fk_product from Product_Purchase_Items"
                                + " WHERE fk_product = " + model.fk_product + " and fk_vendor in (" + model.fk_vendor + ") "
                                + " ";
                dt = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static DataTable Getwarehouse(ProductModel model)
        {
            DataTable dt = new DataTable();
            try
            {
                string strSQl = "select fk_warehouse from product_warehouse "
                                + " WHERE fk_product = " + model.fk_product + " and fk_warehouse in (select WarehouseID from wp_VendorWarehouse where VendorID = " + model.fk_vendor + ") "
                                + " ";
                dt = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static DataTable GetfileCountdata(int fk_product, string FileName)
        {
            DataTable dt = new DataTable();
            try
            {
                string strSQl = "select FileName from product_linkedfiles"
                                + " WHERE fk_product in (" + fk_product + ") and FileName = '" + FileName + "' "
                                + " ;";
                dt = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static DataTable Getcountrystate(string name)
        {
            DataTable dt = new DataTable();
            try
            {
                string strSQl = "select id from Shipping_class"
                                + " WHERE Shippingclass_Name ='" + name + "' "
                                + " limit 10;";
                dt = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataTable Getcountrystatecountry(ProductModel model)
        {
            DataTable dt = new DataTable();
            try
            {
                string strSQl = "select rowid from ShippingClass_Details"
                                + " WHERE fk_ShippingID =" + model.fk_ShippingID + " and countrycode = '" + model.countrycode + "' and statecode = '" + model.statecode + "' "
                                + " ;";
                dt = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static int updateProductwarehouse(ProductModel model, DateTime dateinc)
        {
            int result = 0;
            try
            {
                StringBuilder strSql = new StringBuilder();
                //StringBuilder strSql = new StringBuilder(string.Format("delete from Product_Purchase_Items where fk_product = {0}; ", model.fk_product));
                // strSql.Append(string.Format("insert into Product_Purchase_Items ( fk_vendor,purchase_price,cost_price,minpurchasequantity,salestax,taxrate,discount,remark) values ({0},{1},{2},{3},{4},{5},{6},{7},'{8}') ", model.fk_product, model.fk_vendor, model.purchase_price, model.cost_price, model.minpurchasequantity, model.salestax, model.taxrate, model.discount, model.remark));

                /// step 6 : wp_posts
                strSql.Append(string.Format("update product_warehouse set fk_warehouse = {0} where rowid = {1} ", model.fk_vendor, model.ID));

                result = SQLHelper.ExecuteNonQuery(strSql.ToString());
            }
            catch (Exception ex)
            { throw ex; }
            return result;
        }
        public static int DeleteProductwarehouse(ProductModel model)
        {
            int result = 0;
            try
            {
                //StringBuilder strSql = new StringBuilder();
                //StringBuilder strSql = new StringBuilder(string.Format("delete from product_warehouse where rowid = {0}; ", model.ID));
                StringBuilder strSql = new StringBuilder(string.Format("update product_warehouse set is_active = 0 where rowid = {0}; ", model.ID));
                result = SQLHelper.ExecuteNonQuery(strSql.ToString());
            }
            catch (Exception ex)
            {
                UserActivityLog.ExpectionErrorLog(ex, "Product/DeleteProductwarehouse/" + model.ID + "", "Delete product warehouse");
                throw ex; 
            }
            return result;
        }
        public static int ActiveProductwarehouse(ProductModel model)
        {
            int result = 0;
            try
            {
                //StringBuilder strSql = new StringBuilder();
                //StringBuilder strSql = new StringBuilder(string.Format("delete from product_warehouse where rowid = {0}; ", model.ID));
                StringBuilder strSql = new StringBuilder(string.Format("update product_warehouse set is_active = 1 where rowid = {0}; ", model.ID));
                result = SQLHelper.ExecuteNonQuery(strSql.ToString());
            }
            catch (Exception ex)
            {
                UserActivityLog.ExpectionErrorLog(ex, "Product/ActiveProductwarehouse/" + model.ID + "", "Active product warehouse");
                throw ex; 
            }
            return result;
        }
        public static int Deletefileuploade(ProductModel model)
        {
            int result = 0;
            try
            {
                //StringBuilder strSql = new StringBuilder();
                StringBuilder strSql = new StringBuilder(string.Format("delete from product_linkedfiles where rowid = {0}; ", model.ID));

                result = SQLHelper.ExecuteNonQuery(strSql.ToString());
            }
            catch (Exception ex)
            {
                UserActivityLog.ExpectionErrorLog(ex, "Product/Deletefileuploade/" + model.ID + "", "Delete product linkedfiles");
                throw ex; }
            return result;
        }
        public static int UpdateProductsVariation(string post_title, string post_excerpt, long ID)
        {
            try
            {
                string strsql = "update wp_posts set post_title='" + post_title + "',post_excerpt='" + post_excerpt + "'  where ID =" + ID + "";
                SqlParameter[] para =
                {

                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static void AddProductsMeta(ProductModel model, long id, string varFieldsName, string varFieldsValue)
        {
            try
            {
                string strsql = "erp_product_iud";
                SqlParameter[] para =
                {  
                     new SqlParameter("@qflag", "IM"),
                    new SqlParameter("@post_id", id),
                    new SqlParameter("@meta_key", varFieldsName),
                    new SqlParameter("@meta_value", varFieldsValue),
                };
                SQLHelper.ExecuteNonQuery(strsql, para);
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Product/CreateProduct/" + model.ID + "", "Update Product Meta Data");
                throw Ex;
            }
        }
        public static void AddProductsMetaVariation(long id, string varFieldsName, string varFieldsValue)
        {
            try
            {
                string strsql = "erp_product_iud";
                SqlParameter[] para =
                {
                     new SqlParameter("@qflag", "IM"),
                    new SqlParameter("@post_id", id),
                    new SqlParameter("@meta_key", varFieldsName),
                    new SqlParameter("@meta_value", varFieldsValue),
                };
                SQLHelper.ExecuteNonQuery(strsql, para);
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static int UpdateVariantStatus(List<ProductModelMetaModel> model)
        {
            int result = 0;
            try
            {
                string strSql_insert = string.Empty;
                StringBuilder strSql = new StringBuilder();
                foreach (ProductModelMetaModel obj in model)
                {
                    strSql_insert += (strSql_insert.Length > 0 ? " union all " : "") + string.Format("select '{0}' post_id,'{1}' meta_key,'{2}' meta_value", obj.post_id, obj.meta_key, obj.meta_value);
                    strSql.Append(string.Format("update wp_postmeta set meta_value = '{0}' where post_id = '{1}' and meta_key = '{2}' ; ", obj.meta_value, obj.post_id, obj.meta_key));
                }
                strSql_insert = "insert into wp_postmeta (post_id,meta_key,meta_value) select * from (" + strSql_insert + ") as tmp where tmp.meta_key not in (select meta_key from wp_postmeta where post_id = " + model[0].post_id.ToString() + ");";
                strSql.Append(strSql_insert);
                result = SQLHelper.ExecuteNonQueryWithTrans(strSql.ToString());
            }
            catch (Exception Ex) {
                UserActivityLog.ExpectionErrorLog(Ex, "Product/Savevariations/" + "0" + "", "Update/Insert Product Variation Details");
            }
            return result;
        }

        public static int UpdateItemVariantStatus(List<ProductModelItemModel> model)
        {
            int result = 0;
            try
            {
                string strSql_insert = string.Empty;
                StringBuilder strSql = new StringBuilder();
                foreach (ProductModelItemModel obj in model)
                {
                    strSql.Append("delete from wp_term_relationships where object_id=" + obj.object_id + ";");
                    if (obj.term_taxonomy_id > 0)
                    {
                        
                        strSql.Append("Insert into wp_term_relationships(object_id,term_taxonomy_id,term_order) values(" + obj.object_id + "," + obj.term_taxonomy_id + ",0);");
                    }
                    // strSql_insert += (strSql_insert.Length > 0 ? " union all " : "") + string.Format("select '{0}' post_id,'{1}' meta_key,'{2}' meta_value", obj.post_id, obj.meta_key, obj.meta_value);
                    //strSql.Append(string.Format("update wp_postmeta set meta_value = '{0}' where post_id = '{1}' and meta_key = '{2}' ; ", obj.meta_value, obj.post_id, obj.meta_key));
                }
                //  strSql_insert = "insert into wp_postmeta (post_id,meta_key,meta_value) select * from (" + strSql_insert + ") as tmp where tmp.meta_key not in (select meta_key from wp_postmeta where post_id = " + model[0].post_id.ToString() + ");";
                // strSql.Append(strSql_insert);
                //strSql.Append(string.Format("update wp_posts set post_status = '{0}' where id = {1};", "wc-processing", model[0].post_id));

                result = SQLHelper.ExecuteNonQueryWithTrans(strSql.ToString());
            }
            catch { }
            return result;
        }

        public static int UpdateshippingVariantStatus(List<ProductModelItemModel> model)
        {
            int result = 0;
            try
            {
                string strSql_insert = string.Empty;
                StringBuilder strSql = new StringBuilder();
                foreach (ProductModelItemModel obj in model)
                {
                    strSql.Append("delete from Shipping_Product where fk_productid=" + obj.object_id + ";");
                    strSql.Append("Insert into Shipping_Product(fk_productid,fk_shippingID) values(" + obj.object_id + "," + obj.term_taxonomy_id + ");");

                    // strSql_insert += (strSql_insert.Length > 0 ? " union all " : "") + string.Format("select '{0}' post_id,'{1}' meta_key,'{2}' meta_value", obj.post_id, obj.meta_key, obj.meta_value);
                    //strSql.Append(string.Format("update wp_postmeta set meta_value = '{0}' where post_id = '{1}' and meta_key = '{2}' ; ", obj.meta_value, obj.post_id, obj.meta_key));
                }
                //  strSql_insert = "insert into wp_postmeta (post_id,meta_key,meta_value) select * from (" + strSql_insert + ") as tmp where tmp.meta_key not in (select meta_key from wp_postmeta where post_id = " + model[0].post_id.ToString() + ");";
                // strSql.Append(strSql_insert);
                //strSql.Append(string.Format("update wp_posts set post_status = '{0}' where id = {1};", "wc-processing", model[0].post_id));

                result = SQLHelper.ExecuteNonQueryWithTrans(strSql.ToString());
            }
            catch (Exception Ex) {
                UserActivityLog.ExpectionErrorLog(Ex, "Product/Savevariations/" + "0" + "", "Update/Insert Shipping Product");
            }
            return result;
        }

        public static int UpdatePostStatus(List<ProductModelPostModel> model)
        {
            int result = 0;
            try
            {
                string strSql_insert = string.Empty;
                StringBuilder strSql = new StringBuilder();
                foreach (ProductModelPostModel obj in model)
                {

                    // strSql_insert += (strSql_insert.Length > 0 ? " union all " : "") + string.Format("select '{0}' post_id,'{1}' meta_key,'{2}' meta_value", obj.post_id, obj.meta_key, obj.meta_value);
                    strSql.Append(string.Format("update wp_posts set post_title = '{0}',post_excerpt = '{1}' where ID = '{2}' ; ", obj.post_title, obj.post_excerpt.Trim(), obj.ID));
                }
                result = SQLHelper.ExecuteNonQueryWithTrans(strSql.ToString());
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Product/Savevariations/" + "0" + "", "Update product status");
            }
            return result;
        }
        public static void UpdateProductsMetaVariation(long id, string varFieldsName, string varFieldsValue)
        {
            try
            {
                string strsql = "update wp_postmeta set meta_value=@meta_value where post_id=@post_id and meta_key=@meta_key";
                SqlParameter[] para =
                {
                    new SqlParameter("@post_id", id),
                    new SqlParameter("@meta_key", varFieldsName),
                    new SqlParameter("@meta_value", varFieldsValue),
                };
                SQLHelper.ExecuteNonQuery(strsql, para);
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static int addprice(List<ProductModelPriceModel> model)
        {
            int result = 0;
            try
            {
                string strSql_insert = string.Empty;
                StringBuilder strSql = new StringBuilder();

                foreach (ProductModelPriceModel obj in model)
                {
                    strSql.Append("delete from wp_postmeta where  meta_key = '_price' and post_id =" + obj.post_id + ";");
                }

                foreach (ProductModelPriceModel obj in model)
                {

                    strSql.Append("Insert into wp_postmeta(post_id,meta_key,meta_value) values(" + obj.post_id + ",'" + obj.meta_key + "','" + obj.meta_value + "');");
                    // strSql_insert += (strSql_insert.Length > 0 ? " union all " : "") + string.Format("select '{0}' post_id,'{1}' meta_key,'{2}' meta_value", obj.post_id, obj.meta_key, obj.meta_value);
                    //strSql.Append(string.Format("update wp_postmeta set meta_value = '{0}' where post_id = '{1}' and meta_key = '{2}' ; ", obj.meta_value, obj.post_id, obj.meta_key));
                }

                result = SQLHelper.ExecuteNonQueryWithTrans(strSql.ToString());
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Product/Savevariations/" + "0" + "", "Insert product _price details");
            }
            return result;
        }

        public static int Childvariations(List<ProductChildModel> model)
        {
            int result = 1;
            try
            {
                string strSql_insert = string.Empty;
                StringBuilder strSql = new StringBuilder();

                //foreach (ProductChildModel obj in model)
                //{
                //    strSql.Append("delete from product_association where fk_product =" + obj.fk_product + ";");
                //}
                string res = string.Empty;
                foreach (ProductChildModel obj in model)
                {

                    // strSql.Append("Insert into product_association(fk_product,fk_product_fils,qty) values(" + obj.fk_product + ",'" + obj.fk_product_fils + "','" + obj.qty + "');SELECT LAST_INSERT_ID();");
                    //strSql.Append("Insert into wp_product_free(product_id,free_product_id,free_quantity) values(" + obj.fk_product + ",'" + obj.fk_product_fils + "','" + obj.qty + "');");

                    // strSql_insert += (strSql_insert.Length > 0 ? " union all " : "") + string.Format("select '{0}' post_id,'{1}' meta_key,'{2}' meta_value", obj.post_id, obj.meta_key, obj.meta_value);
                    //strSql.Append(string.Format("update wp_postmeta set meta_value = '{0}' where post_id = '{1}' and meta_key = '{2}' ; ", obj.meta_value, obj.post_id, obj.meta_key));

                    SqlParameter[] parameters =
                 {
                    new SqlParameter("@qflag", "I"),
                    new SqlParameter("@product_id", obj.fk_product),
                    new SqlParameter("@free_product_id", obj.fk_product_fils),
                    new SqlParameter("@free_quantity", obj.qty),
                 };
                    res = SQLHelper.ExecuteScalar("erp_parentproductchild_iud", parameters).ToString();


                }

                //result = SQLHelper.ExecuteNonQueryWithTrans(strSql.ToString());
            }
            catch (Exception Ex ) {
                UserActivityLog.ExpectionErrorLog(Ex, "Product/SaveChildvariations/" + "0" + "", "Insert Child variations");
            }
            return result;
        }

        public static int SaveComponentChildvariations(List<ProductChildModel> model)
        {
            int result = 1;
            try
            {
                string strSql_insert = string.Empty;
                StringBuilder strSql = new StringBuilder();
                //foreach (ProductChildModel obj in model)
                //{
                //    strSql.Append("Insert into erp_product_component(product_id,component_product_id,component_quantity) values(" + obj.fk_product + ",'" + obj.fk_product_fils + "','" + obj.qty + "');");
                //}
                //result = SQLHelper.ExecuteNonQueryWithTrans(strSql.ToString());
                string res = string.Empty;
                foreach (ProductChildModel obj in model)
                {
                    SqlParameter[] parameters =
               {
                    new SqlParameter("@qflag", "I"),
                    new SqlParameter("@product_id", obj.fk_product),
                    new SqlParameter("@component_product_id", obj.fk_product_fils),
                    new SqlParameter("@component_quantity", obj.qty),
                 };
                    res = SQLHelper.ExecuteScalar("erp_productcomponent_iud", parameters).ToString();
                    //result = 1;            
                    // string 
                    // if (res.StartsWith("Success")) result = 1;
                }
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Product/SaveComponentChildvariations/" + "0" + "", "Insert Child variations");
            }
            return result;
        }


        public static int UpdateChildvariations(List<ProductChildModel> model)
        {
            int result = 0;
            try
            {
                string strSql_insert = string.Empty;
                StringBuilder strSql = new StringBuilder();
                foreach (ProductChildModel obj in model)
                {
                    if (obj.qty == 0)
                        strSql.Append("delete from wp_product_free where product_id =" + obj.fk_product + " and free_product_id =" + obj.fk_product_fils + ";");
                    else
                        strSql.Append(string.Format("update wp_product_free set free_quantity = '{0}' where free_product_id = '{1}' and product_id = '{2}' ; ", obj.qty, obj.fk_product_fils, obj.fk_product));

                    //if (obj.qty == 0)
                    //    strSql.Append("delete from product_association where fk_product =" + obj.fk_product + " and fk_product_fils =" + obj.fk_product_fils + ";");
                    //else
                    //    strSql.Append(string.Format("update product_association set qty = '{0}' where fk_product_fils = '{1}' and fk_product = '{2}' ; ", obj.qty, obj.fk_product_fils, obj.fk_product));
                }
                result = SQLHelper.ExecuteNonQueryWithTrans(strSql.ToString());
            }
            catch (Exception Ex){
                UserActivityLog.ExpectionErrorLog(Ex, "Product/UpdateChildvariations/" + "0" + "", "Update Product Free Quantity");
            }
            return result;
        }


        public static void Add_term(int TermID, int ID)
        {
            try
            {
                string strsql = "erp_product_iud";
                SqlParameter[] para =
                {
                    new SqlParameter("@qflag", "IT"),
                    new SqlParameter("@object_id", ID),
                    new SqlParameter("@term_taxonomy_id", TermID),
                    new SqlParameter("@term_order", "0")

                };            
                SQLHelper.ExecuteScalar(strsql, para);
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Product/update_term/" + ID + "", "Add Term Product");
                throw Ex;
            }
        }


        public static int update_count(int TermID, int ID)
        {
            int result = 0;
            try
            {
                //string strSql_insert = string.Empty;
                //StringBuilder strSql = new StringBuilder();
                //strSql.Append(string.Format("update wp_term_taxonomy set count = count-1 where term_taxonomy_id = {0} ; ", TermID));
                //result = SQLHelper.ExecuteNonQueryWithTrans(strSql.ToString());

                string strsql = "erp_product_iud";
                SqlParameter[] para =
                {
                    new SqlParameter("@qflag", "DC"),
                    new SqlParameter("@TermID", TermID)

                };
                SQLHelper.ExecuteScalar(strsql, para);
            }
            catch { }
            return result;
        }

        public static int update_countinc(int TermID, int ID)
        {
            int result = 0;
            try
             {
            //    string strSql_insert = string.Empty;
            //    StringBuilder strSql = new StringBuilder();
            //    strSql.Append(string.Format("update wp_term_taxonomy set count = count+1 where term_taxonomy_id = {0} ; ", TermID));
            //    result = SQLHelper.ExecuteNonQueryWithTrans(strSql.ToString());

                string strsql = "erp_product_iud";
                SqlParameter[] para =
                {
                    new SqlParameter("@qflag", "UC"),
                    new SqlParameter("@TermID", TermID)

                };
                SQLHelper.ExecuteScalar(strsql, para);

            }
            catch { }
            return result;
        }

        public static void Add_Shipping(int TermID, int ID)
        {
            try
            {
                string strsql = "erp_product_iud";
                SqlParameter[] para =
                {
                    new SqlParameter("@qflag", "IS"),
                    new SqlParameter("@fkTermID", ID),
                    new SqlParameter("@TermID", TermID)                    

                };
                 SQLHelper.ExecuteScalar(strsql, para);


                //StringBuilder strSql = new StringBuilder();
                //strSql.Append("delete from Shipping_Product where fk_productid=" + ID + ";");
                //strSql.Append("Insert into Shipping_Product(fk_productid,fk_shippingID) values(" + ID + "," + TermID + ");");
                //int result = SQLHelper.ExecuteNonQueryWithTrans(strSql.ToString());

            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Product/update_term/" + ID + "", "Add Shipping Product");
                throw Ex;
            }
        }
        public static void Edit_term(int TermID, int ID)
        {
            try
            {
                string strsql = "erp_product_iud";
                SqlParameter[] para =
                 {
                      new SqlParameter("@qflag", "D"),
                    new SqlParameter("@id", ID)
                     };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));

            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Product/delete_term/" + ID + "", "Delete Term");
                throw Ex;
            }
        }
        public static void UpdateMetaData(ProductModel model, long id, string varFieldsName, string varFieldsValue)
        {
            try
            {
                string strsql = "erp_product_iud";
                SqlParameter[] para =
                {
                    new SqlParameter("@qflag", "UM"),
                    new SqlParameter("@post_id", id),
                    new SqlParameter("@meta_key", varFieldsName),
                    new SqlParameter("@meta_value", varFieldsValue),
                };
                SQLHelper.ExecuteNonQuery(strsql, para);
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Product/CreateProduct/" + id + "", "Product Update Meta Data Details");
                throw Ex;
            }
        }

        public static DataTable GetProdctByID(OrderPostStatusModel model)
        {
            DataTable dt = new DataTable();

            try
            {
                string strWhr = string.Empty;
                if (!string.IsNullOrEmpty(model.strVal))
                {
                    string strSQl = "select p.id, CONCAT(p.post_title,'(',MAX(CASE WHEN pm1.meta_key = '_sku' then pm1.meta_value else null end) , ')') as Name"
                                + " FROM wp_posts p LEFT JOIN wp_postmeta pm1 ON pm1.post_id = p.ID and pm1.meta_key = '_sku'"
                                + " WHERE pm1.meta_value is not NULL and p.id in (" + model.strVal + ") "
                                + " GROUP BY p.ID,post_title ";

                    dt = SQLHelper.ExecuteDataTable(strSQl);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        //notes
        public static DataTable GetNotes(long OrderID, string type)
        {
            DataTable DT = new DataTable();
            try
            {
                string strSQl = string.Empty;
                SqlParameter[] parameters =
                {
                    new SqlParameter("order_id", OrderID)
                };
                if (type.ToUpper() == "ADMINISTRATOR")
                {
                    strSQl = "select wp_c.comment_ID,FORMAT(wp_c.comment_date,'MM/dd/yyyy hh:mm tt') comment_date,wp_c.comment_content,case when comment_type = 'Private' then 1 else 0 end is_customer_note from wp_Productnotes wp_c"
                            + " where  comment_approved = '1' and comment_post_ID = @order_id order by wp_c.comment_ID desc;";
                }
                else
                {
                    strSQl = "select wp_c.comment_ID,FORMAT(wp_c.comment_date,'MM/dd/yyyy hh:mm tt') comment_date,wp_c.comment_content,wp_cm.meta_value is_customer_note from wp_Productnotes wp_c"
                            + " where comment_type = 'Public' and comment_approved = '1' and comment_post_ID = @order_id order by wp_c.comment_ID desc;";
                }
                DT = SQLHelper.ExecuteDataTable(strSQl, parameters);
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }
        public static int AddNotes(OrderNotesModel obj)
        {
            int result = 0;
            try
            {
                obj.comment_date = DateTime.UtcNow.AddMinutes(-420);
                obj.comment_date_gmt = DateTime.UtcNow;

                string strSQL = "INSERT INTO wp_Productnotes(comment_post_ID,comment_date, comment_date_gmt, comment_content,  comment_approved, comment_type,user_id)"
                            + " VALUES(@comment_post_ID,@comment_date,@comment_date_gmt,@comment_content,'1',@comment_type,'0');";


                SqlParameter[] parameters =
                {
                    new SqlParameter("@comment_post_ID", obj.post_ID),
                    new SqlParameter("@comment_date", obj.comment_date),
                    new SqlParameter("@comment_date_gmt", obj.comment_date_gmt),
                    new SqlParameter("@comment_content", obj.comment_content),
                    new SqlParameter("@comment_type", obj.is_customer_note)
                };
                result = SQLHelper.ExecuteNonQuery(strSQL, parameters);
            }
            catch (Exception ex)
            {
                UserActivityLog.ExpectionErrorLog(ex, "Product/NoteAdd/" + obj.post_ID + "", "Product Note Add");
                throw ex;
            }
            return result;
        }
        public static int RemoveNotes(OrderNotesModel obj)
        {
            int result = 0;
            try
            {
                //string strSQL = "delete from wp_comments where comment_ID = @comment_ID;";
                string strSQL = "update wp_Productnotes set comment_approved = '0' where comment_ID = @comment_ID;";
                SqlParameter[] parameters =
                {
                    new SqlParameter("@comment_ID", obj.comment_ID)
                };
                result = SQLHelper.ExecuteNonQuery(strSQL, parameters);
            }
            catch (Exception ex)
            {
                UserActivityLog.ExpectionErrorLog(ex, "Product/NoteDelete/" + obj.post_ID + "", "Product Note Delete");
                throw ex;
            }
            return result;
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Product Categories~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //public static DataSet GetParentCategory(string term_taxonomy_id)
        //{
        //    DataSet DS = new DataSet();
        //    try
        //    {
        //        string strSQl = "Select tx.term_taxonomy_id ID, if(tx.parent=0,t.name,concat('- ',t.name)) name,tx.parent  " +
        //            "from wp_terms t left join wp_term_taxonomy tx on tx.term_id = t.term_id left join wp_termmeta tm_a on tm_a.term_id = t.term_id and tm_a.meta_key = 'Is_Active' " +
        //            "where taxonomy = 'product_cat' and coalesce(tm_a.meta_value,'1') = '1' and tx.term_taxonomy_id !='"+term_taxonomy_id+"' and 1 = 1 order by CASE WHEN tx.parent = 0 THEN tx.term_taxonomy_id ELSE tx.parent END DESC, CASE WHEN tx.parent = tx.term_taxonomy_id " +
        //            "THEN tx.parent ELSE tx.parent END ASC; ";
        //        DS = SQLHelper.ExecuteDataSet(strSQl);
        //    }
        //    catch (Exception ex)
        //    { throw ex; }
        //    return DS;
        //}

        public static DataTable GetParentCategory(string term_taxonomy_id)
        {
            DataTable DS = new DataTable();
            try
            {

                string strSQl = "erp_ProductCategory";
                SqlParameter[] para =
                {
                    new SqlParameter("@Flag", "CategoryList")
                };
                DS = SQLHelper.ExecuteDataTable(strSQl, para);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }
        public int EditProductCategory(ProductCategoryModel model, string name, string slug, string parent, string description, long thumbnailID)
        {
            try
            {
                string strsql = "";
                strsql = "update wp_terms set name=@name,slug=@slug where term_id=" + model.term_id + "; update wp_term_taxonomy set description=@description,parent=@parent where term_id=" + model.term_id + ";" +
                    " Update wp_termmeta set meta_value='" + model.display_type + "' where term_id=" + model.term_id + " and meta_key='display_type';" +
                    " Update wp_termmeta set meta_value='" + thumbnailID + "' where term_id=" + model.term_id + " and meta_key='thumbnail_id';";
                SqlParameter[] para =
                {
                    new SqlParameter("@name", model.name),
                    new SqlParameter("@slug",  Regex.Replace(model.slug, @"\s+", "")),
                    new SqlParameter("@parent", model.parent),
                    new SqlParameter("@description", model.description == null ? "" : model.description),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Product/AddProductCategory/" + model.parent + "", "Update product category meta data");
                throw Ex;
            }
        }

        public static int EditProductImage(string FileName, long metaid)
        {
            try
            {
                string strsql = "";
                strsql = "update wp_posts set guid = @guid" +
                         " where ID=" + metaid + " ;";
                SqlParameter[] para =
               {
                    new SqlParameter("@guid", FileName=="" ? "default.png" : FileName)
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static int thumbnailsImage(string FileName, long metaid)
        {
            int result = 0;
            try
            {
                if (FileName == "")
                    FileName = "default.png";
                StringBuilder strSql = new StringBuilder();
                strSql.Append(string.Format("insert into wp_image (id,thumbnails,image) values ({0},'{1}','{2}'); ", metaid, FileName, "default.png"));
                result = SQLHelper.ExecuteNonQuery(strSql.ToString());
            }
            catch (Exception ex)
            { throw ex; }
            return result;
        }
        public static int updatethumbnailsImage(string FileName, long metaid)
        {
            int result = 0;
            try
            {
                if (FileName == "")
                    FileName = "default.png";
                StringBuilder strSql = new StringBuilder();
                strSql.Append(string.Format("update wp_image set thumbnails = '{0}' where id = {1} ", FileName, metaid));
                result = SQLHelper.ExecuteNonQuery(strSql.ToString());
            }
            catch (Exception ex)
            { throw ex; }
            return result;
        }
        public static int PopupImage(string FileName, long metaid)
        {
            int result = 0;
            try
            {
                if (FileName == "")
                    FileName = "default.png";
                StringBuilder strSql = new StringBuilder();
                strSql.Append(string.Format("insert into wp_image (id,thumbnails,image) values ({0},'{1}','{2}'); ", metaid, "default.png", FileName));
                result = SQLHelper.ExecuteNonQuery(strSql.ToString());
            }
            catch (Exception ex)
            { throw ex; }
            return result;
        }

        public static int UpdatePopupImage(string FileName, long metaid)
        {
            int result = 0;
            try
            {
                if (FileName == "")
                    FileName = "default.png";
                StringBuilder strSql = new StringBuilder();
                strSql.Append(string.Format("update wp_image set image = '{0}' where id = {1} ", FileName, metaid));
                result = SQLHelper.ExecuteNonQuery(strSql.ToString());
            }
            catch (Exception ex)
            { throw ex; }
            return result;
        }

        public static int PopupBothImage(string thumbFileName, string FileName, long metaid)
        {
            int result = 0;
            try
            {
                //if (FileName == "")
                //    FileName = "default.png";
                StringBuilder strSql = new StringBuilder();
                strSql.Append(string.Format("insert into wp_image (id,thumbnails,image) values ({0},'{1}','{2}'); ", metaid, thumbFileName, FileName));
                result = SQLHelper.ExecuteNonQuery(strSql.ToString());
            }
            catch (Exception ex)
            {
                UserActivityLog.ExpectionErrorLog(ex, "Product/ProductImages/" + metaid + "", "Add Product Image");
                throw ex; 
            }
            return result;
        }

        public static int UpdateBothImage(string thumbFileName, string FileName, long metaid)
        {
            int result = 0;
            try
            {
                //if (FileName == "")
                //    FileName = "default.png";
                StringBuilder strSql = new StringBuilder();
                strSql.Append(string.Format("update wp_image set thumbnails = '{0}', image = '{1}' where id = {2} ", thumbFileName, FileName, metaid));
                result = SQLHelper.ExecuteNonQuery(strSql.ToString());
            }
            catch (Exception ex)
            {
                UserActivityLog.ExpectionErrorLog(ex, "Product/ProductImages/" + metaid + "", "Update Product Image");
                throw ex; 
            }
            return result;
        }
        public int AddProductCategory(ProductCategoryModel model, string name, string slug)
        {
            try
            {
                string strsql = "";
                strsql = "erp_ProductCategory";
                SqlParameter[] para =
                {
                    new SqlParameter("@Flag", "AddProductCategory"),
                    new SqlParameter("@name", name),
                    new SqlParameter("@slug",  Regex.Replace(slug, @"\s+", "-")),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public static DataTable GetImage_Details(int ID)
        {
            DataTable dt = new DataTable();
            try
            {
                string strSQl = "select id from wp_image"
                                + " WHERE id = " + ID + " ";
                dt = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public int AddProductCategoryDesc(ProductCategoryModel model, long term_id, int thumbnail_id)
        {
            try
            {
                string strsql = "";
                strsql = "erp_ProductCategory";
                SqlParameter[] para =
                {
                    new SqlParameter("@Flag", "AddProductCategoryDescription"),
                    new SqlParameter("@term_id", term_id),
                    new SqlParameter("@taxonomy", "product_cat"),
                    new SqlParameter("@parent", model.parent),
                    new SqlParameter("@description", model.description == null ? "" : model.description),
                    new SqlParameter("@display_type", model.display_type.ToString()),
                    new SqlParameter("@thumbnail_id",thumbnail_id),

                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Product/AddProductCategory/" + "0" + "", "Add product category description");
                throw Ex;
            }
        }
        //public static DataTable ProductCategoryList(long id, string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        //{
        //    DataTable dt = new DataTable();
        //    totalrows = 0;
        //    try
        //    {
        //        string strWhr = string.Empty;

        //        string strSql = "Select ifnull(p.post_title,'default.png') ImagePath,  tm.meta_key, tx.term_id ID,if(tx.parent=0,t.name,concat('# ',t.name)) name, " +
        //            "t.slug,tx.taxonomy,tx.description,tx.parent, (Select Count(*) from wp_term_relationships where term_taxonomy_id=t.term_id) count,tm.meta_value thumbnailId, coalesce(tm_a.meta_value, '1') Active " +
        //            "from wp_terms t left join wp_term_taxonomy tx on tx.term_id = t.term_id left join wp_termmeta tm on t.term_id = tm.term_id and tm.meta_key = 'thumbnail_id' left join wp_termmeta tm_a on tm_a.term_id = t.term_id and tm_a.meta_key = 'Is_Active' " +
        //            "left join wp_posts p on tm.meta_value = p.ID where taxonomy = 'product_cat' and coalesce(tm_a.meta_value,'1') = '1' and 1 = 1  ";
        //        if (!string.IsNullOrEmpty(searchid))
        //        {
        //            strWhr += " and (t.name like '%" + searchid + "%')";
        //        }
        //        if (userstatus != null)
        //        {
        //            strWhr += " and (v.VendorStatus='" + userstatus + "') ";
        //        }
        //        //strSql += strWhr + string.Format(" order by {0} {1} LIMIT {2}, {3}", SortCol, SortDir, pageno.ToString(), pagesize.ToString());
        //        strSql += strWhr + string.Format(" order by {0} LIMIT {1}, {2}", "CASE WHEN tx.parent = 0 THEN tx.term_taxonomy_id ELSE tx.parent END DESC, CASE WHEN tx.parent = tx.term_taxonomy_id THEN tx.parent ELSE tx.parent END ASC ", pageno.ToString(), pagesize.ToString());

        //        strSql += "; SELECT ceil(Count(tx.term_id)/" + pagesize.ToString() + ") TotalPage,Count(tx.term_id) TotalRecord  from wp_terms t left join wp_term_taxonomy tx on tx.term_id = t.term_id left join wp_termmeta tm on t.term_id = tm.term_id and tm.meta_key = 'thumbnail_id' left join wp_termmeta tm_a on tm_a.term_id = t.term_id and tm_a.meta_key = 'Is_Active' " +
        //            "left join wp_posts p on tm.meta_value = p.ID where taxonomy = 'product_cat' and coalesce(tm_a.meta_value,'1') = '1' and 1 = 1   " + strWhr.ToString();

        //        DataSet ds = SQLHelper.ExecuteDataSet(strSql);
        //        dt = ds.Tables[0];
        //        if (ds.Tables[1].Rows.Count > 0)
        //            totalrows = Convert.ToInt32(ds.Tables[1].Rows[0]["TotalRecord"].ToString());
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex;
        //    }
        //    return dt;
        //}

        public static DataTable ProductCategoryList(long id, string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strSQl = "erp_ProductCategory";
                SqlParameter[] para =
                {
                    new SqlParameter("@Flag", "CategoryListWithParameter")
                };
                dt = SQLHelper.ExecuteDataTable(strSQl, para);

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public int DeleteProductCategory(string val)
        {
            try
            {
                int result = 0;

                string metaValue = GetTermID(val).ToString();
                string[] value = metaValue.Split(',');
                for (int i = 0; i <= value.Length - 1; i++)
                {
                    var termID = value[i].ToString();
                    string IsActiveID = GetIsActiveID(termID).ToString();
                    string strsql = "";
                    if (IsActiveID == termID)
                    {
                        strsql = "Update wp_termmeta set meta_value='0' where term_id=" + termID + " and meta_key='Is_Active';";
                    }
                    else
                    {
                        strsql = "insert into wp_termmeta(term_id,meta_key,meta_value) values(" + termID + ",'Is_Active','0');";
                    }
                    result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql));
                }
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public int DeleteProductfromCategory(string val)
        {
            try
            {
                int result = 0;
                string metaValue = GetProductID(val).ToString();
                if (metaValue != "")
                {
                    string[] value = metaValue.Split(',');
                    for (int i = 0; i <= value.Length - 1; i++)
                    {
                        var ProductID = value[i].ToString();
                        string strsql = "Delete r from wp_term_relationships r inner join wp_term_taxonomy t on t.term_id = r.term_taxonomy_id where t.taxonomy = 'product_cat' and object_id =" + ProductID + "; " +
                            "Insert into wp_term_relationships(object_id, term_taxonomy_id, term_order) values(" + ProductID + ", 80, 0);";
                        result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql));
                    }
                }
                else
                {
                    result = 0;
                }
                return result;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Product/DeleteCategorywithProduct/" + "0" + "", "Delete category with product");
                throw Ex;
            }
        }
        public static DataTable GetCategoryByID(long id)
        {
            DataTable dt = new DataTable();
            try
            {
                string strWhr = string.Empty;
                string strSql = "erp_ProductCategory";
                SqlParameter[] para =
               {
                    new SqlParameter("@Flag", "getProductCategoryByID"),
                    new SqlParameter("@term_id", id)
                    };
                DataSet ds = SQLHelper.ExecuteDataSet(strSql, para);
                dt = ds.Tables[0];
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static int AddImage(string FileName, string FilePath, string FileType)
        {
            try
            {
                string strsql = "";
                strsql = "erp_ProductCategory";
                SqlParameter[] para =
               {
                    new SqlParameter("@Flag", "AddProductImage"),
                    new SqlParameter("@post_author", "8"),
                    new SqlParameter("@post_content", ""),
                    new SqlParameter("@post_title", FileName=="" ? "default.png" : FileName),
                    new SqlParameter("@post_excerpt", ""),
                    new SqlParameter("@post_status", "inherit"),
                    new SqlParameter("@comment_status", "closed"),
                    new SqlParameter("@ping_status", "closed"),
                    new SqlParameter("@post_name", FileName=="" ? "default.png" : FileName),
                    new SqlParameter("@to_ping", ""),
                    new SqlParameter("@pinged", ""),
                    new SqlParameter("@post_content_filtered", ""),

                    new SqlParameter("@post_type", "product_cat"),
                    new SqlParameter("@post_mime_type", FileType),
                    new SqlParameter("@guid", FileName=="" ? "default.png" : FileName),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Product/AddProductCategory/" + "0" + "", "Add product category image");
                throw Ex;
            }
        }
        public static int EditImage(string FileName, string FilePath, string FileType, long metaid)
        {
            try
            {
                string strsql = "";
                strsql = "erp_ProductCategory";
                SqlParameter[] para =
               {
                    new SqlParameter("@Flag", "EditProductImage"),
                    new SqlParameter("@meta_id", metaid),
                    new SqlParameter("@post_author", "8"),
                    new SqlParameter("@post_title", FileName=="" ? "default.png" : FileName),
                    new SqlParameter("@post_status", "inherit"),
                    new SqlParameter("@comment_status", "closed"),
                    new SqlParameter("@ping_status", "closed"),
                    new SqlParameter("@post_name", FileName=="" ? "default.png" : FileName),
                    new SqlParameter("@post_type", "product_cat"),
                    new SqlParameter("@post_mime_type", FileType),
                    new SqlParameter("@guid", FileName=="" ? "default.png" : FileName),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public static int postmeta(int post_id, string FilePath)
        {
            try
            {
                string strsql = "";
                strsql = "erp_ProductCategory";
                SqlParameter[] para =
               {
                    new SqlParameter("@Flag", "AddProductCategoryImageMetaData"),
                    new SqlParameter("@post_id", post_id),
                    new SqlParameter("@_wp_attached_file", FilePath),
                    new SqlParameter("@_wp_attachment_metadata", FilePath),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;


            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public static int EditPostMeta(long post_id, string FilePath, string FileName)
        {
            try
            {
                string strsql = "";
                strsql = "erp_ProductCategory";
                SqlParameter[] para =
               {
                    new SqlParameter("@Flag", "EditProductCategoryImageMetaData"),
                    new SqlParameter("@post_id", post_id),
                    new SqlParameter("@guid", FilePath),
                    new SqlParameter("@post_title", FileName=="" ? "default.png" : FileName),
                    new SqlParameter("@post_name", FileName=="" ? "default.png" : FileName),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;


            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Product/AddProductCategory/" + post_id + "", "Update Product Category");
                throw Ex;
            }
        }
        public string GetFileName(long PostID)
        {
            string result = "";
            DataTable dt = new DataTable();
            try
            {
                string strSQl = "SELECT post_title FROM wp_posts WHERE ID = " + PostID + ";";
                object resultObj = SQLHelper.ExecuteScalar(strSQl);

                if (resultObj != null)
                {
                    result = resultObj.ToString();
                }
                else
                {
                    result = "";
                    // Handle the case where the SQL query did not return a result
                    // You can assign a default value or take some other action here.
                }
                //return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }

        public string GetCountforupdate(long PostID)
        {
            string result = "";
            DataTable dt = new DataTable();
            try
            {
                string strSQl = "select string_agg(tm. term_taxonomy_id,',') ID from wp_term_relationships tr inner join wp_term_taxonomy tm on tm. term_taxonomy_id = tr.term_taxonomy_id  and taxonomy = 'product_cat'  WHERE object_id =" + PostID + "; ";
                result = SQLHelper.ExecuteScalar(strSQl).ToString();
                //return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }
        public string GetName(string name)
        {
            string result = "";
            DataSet ds = new DataSet();
            try
            {
                string strSQl = "Select name from wp_terms t left join wp_term_taxonomy tx on t.term_id = tx.term_id left join wp_termmeta tm on t.term_id = tm.term_id and tm.meta_key = 'Is_Active' where name = '" + name + "' and coalesce(tm.meta_value,'1') = '1' and tx.taxonomy='product_cat';";
                ds = SQLHelper.ExecuteDataSet(strSQl);
                if (ds.Tables[0].Rows.Count > 0)
                    result = ds.Tables[0].Rows[0]["name"].ToString();
                else
                    result = "0";
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }

        public string GetNameonEdit(string name, long termID)
        {
            string result = "";
            DataSet ds = new DataSet();
            try
            {
                string strSQl = "Select name from wp_terms t left join wp_term_taxonomy tx on t.term_id = tx.term_id left join wp_termmeta tm on t.term_id = tm.term_id and tm.meta_key = 'Is_Active' where name = '" + name + "' and t.term_id not in ('" + termID + "') and coalesce(tm.meta_value,'1') ='1' and tx.taxonomy='product_cat';";
                ds = SQLHelper.ExecuteDataSet(strSQl);
                if (ds.Tables[0].Rows.Count > 0)
                    result = ds.Tables[0].Rows[0]["name"].ToString();
                else
                    result = "0";
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }

        //public string GetTermID(string ID)
        //{
        //    string result = "";
        //    DataSet ds = new DataSet();
        //    try
        //    {
        //        string strSQl = "Select GROUP_CONCAT(term_id) term_id from wp_term_taxonomy where  parent in (" + ID + ") or term_id in (" + ID + "); ";
        //        ds = SQLHelper.ExecuteDataSet(strSQl);
        //        if (ds.Tables[0].Rows.Count > 0)
        //            result = ds.Tables[0].Rows[0]["term_id"].ToString();
        //        else
        //            result = "0";
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex;
        //    }
        //    return result;
        //}

        public string GetTermID(string ID)
        {
            string result = "";
            DataSet ds = new DataSet();
            try
            {
                string[] value = ID.Split(',');
                for (int i = 0; i <= value.Length - 1; i++)
                {
                    var termID = value[i].ToString();
                    string strSQl = "";
                    strSQl = "erp_ProductCategory";
                    SqlParameter[] para =
                    {
                    new SqlParameter("@Flag", "getTermID"),
                    new SqlParameter("@Userterm_ID", termID)

                   };
                    ds = SQLHelper.ExecuteDataSet(strSQl, para);

                    if (!string.IsNullOrEmpty(ds.Tables[0].Rows[0]["term_id"].ToString()))
                        result += ds.Tables[0].Rows[0]["term_id"].ToString() + ",";
                    else
                        result = "0";
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result.TrimEnd(',');
        }
        public string GetChildTermID(string ID)
        {
            string result = "";
            DataSet ds = new DataSet();
            try
            {
                string strSQl = "SELECT group_concat(c.term_id) as term_id FROM wp_terms t " +
                    "inner join wp_term_taxonomy c on t.term_id = c.term_id " +
                    "left join wp_termmeta tm_a on tm_a.term_id = t.term_id and tm_a.meta_key = 'Is_Active' " +
                    "where coalesce(tm_a.meta_value,'1') = '1' and t.term_id in (" + ID + ")";

                ds = SQLHelper.ExecuteDataSet(strSQl);
                if (ds.Tables[0].Rows.Count > 0)
                    result = ds.Tables[0].Rows[0]["term_id"].ToString();
                else
                    result = "0";
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }
        public string GetProductID(string ID)
        {
            string result = "";
            DataSet dt = new DataSet();
            try
            {
                string[] value = ID.Split(',');
                for (int i = 0; i <= value.Length - 1; i++)
                {
                    var termID = value[i].ToString();
                    string strSQl = "";
                    strSQl = "erp_ProductCategory";
                    SqlParameter[] para =
                       {
                        new SqlParameter("@Flag", "getProductID"),
                        new SqlParameter("@Userterm_ID", termID)
                       };
                    DataSet ds = SQLHelper.ExecuteDataSet(strSQl, para);
                    if (!string.IsNullOrEmpty(ds.Tables[0].Rows[0]["object_id"].ToString()))
                        result = ds.Tables[0].Rows[0]["object_id"].ToString() + ",";
                    else
                        result = "0";
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result.TrimEnd(',');
        }

        public string GetIsActiveID(string ID)
        {
            string result = "";
            DataSet dt = new DataSet();
            try
            {
                string strSQl = "Select term_id from wp_termmeta where term_id=" + ID + " and meta_key='Is_Active';";
                DataSet ds = SQLHelper.ExecuteDataSet(strSQl);
                if (ds.Tables[0].Rows.Count > 0)
                    result = ds.Tables[0].Rows[0]["term_id"].ToString();
                else
                    result = "0";
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }
        public static DataSet Getpricedetails(long id, long vid)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] para = {
                    new SqlParameter("@fk_product", id),
                    new SqlParameter("@fk_vendor", vid)
                };
                ds = SQLHelper.ExecuteDataSet("erp_productpricedetails", para);
                ds.Tables[0].TableName = "po"; ds.Tables[1].TableName = "pod";
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }
        public static DataTable GetProductOpeningStock(string strValue1, string userstatus,  string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "product_id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            string strWhr = string.Empty;
            try
            {
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (op.product_id like '%" + searchid + "%' "
                            + " OR p.post_title like '%" + searchid + "%' "
                            + " OR op_qty like '%" + searchid + "%' "
                            + " OR op_rate like '%" + searchid + "%' "
                            + " )";
                }
                string strSQl = "select op.product_id, FORMAT(op_date,'MM/dd/yyyy') op_date,op_qty,op_rate,tag,p.post_title as Name FROM wp_posts p, product_opening_stock op where op.product_id = p.id and (p.post_type = 'product' Or post_type = 'product_variation') " + strWhr 
                +" order by " + SortCol + " " + SortDir + " OFFSET " + (pageno).ToString() + " ROWS FETCH NEXT " + pagesize + " ROWS ONLY; ";
                strSQl += "; select count(op.product_id) TotalRecord FROM wp_posts p, product_opening_stock op where op.product_id = p.id and (p.post_type = 'product' Or post_type = 'product_variation')" + strWhr;
                 DataSet ds = SQLHelper.ExecuteDataSet(strSQl);
                dt = ds.Tables[0];
                if (ds.Tables[1].Rows.Count > 0)
                    totalrows = Convert.ToInt32(ds.Tables[1].Rows[0]["TotalRecord"].ToString());
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static int AddProductOpeningStock(ProductOpendingStock model)
        {
            try
            {
                DataTable dt = new DataTable();
               // string strsql = "INSERT into product_warehouse_rule_details(fk_product_rule, country, state, fk_vendor, fk_warehouse) values(@fk_product_rule, @country, @state, @fk_vendor, @fk_warehouse); SELECT SCOPE_IDENTITY();";
                SqlParameter[] para =
                {
                    new SqlParameter("@product_id", model.product_id),
                    new SqlParameter("@op_qty",model.op_qty),
                    new SqlParameter("@op_rate",model.op_rate),
                    new SqlParameter("@tag",model.tag),
                     
               };
                dt = SQLHelper.ExecuteDataTable("erp_product_opening_stock_iud", para);
                int result = Convert.ToInt32(dt.Rows[0]["id"]);
                //int result = Convert.ToInt32(DAL.SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Product/AddProductOpeningStock/" + model.product_id + "", "Insert Product Opening Stock.");
                throw Ex;
            }
        }
        public static int GetProductCount(SetupModel model)
        {
            try
            {
                string strquery = "SELECT COUNT(product_id) from product_opening_stock WHERE product_id = '" + model.product_id + "' ";
                SqlParameter[] para =
                {

                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strquery).ToString());
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static DataTable GetOpeningById(string id)
        {
            DataTable dt = new DataTable();
            string strQuery = string.Empty;
            try
            {
                strQuery = "SELECT product_id, op_qty, op_rate, tag FROM product_opening_stock where product_id =" + id + "";
                dt = SQLHelper.ExecuteDataTable(strQuery);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public int UpdatecomponentStatus(AccountingJournalModel model)
        {
            try
            {
                string strsql = "";
                strsql = "Update wp_product_free set status=@status where product_id=@product_id and free_product_id =@free_product_id ;";
                SqlParameter[] para =
                {
                    new SqlParameter("@free_product_id", model.rowid),
                    new SqlParameter("@status", model.active),
                      new SqlParameter("@product_id", model.code),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static List<ProductModelservices> GetComponentProductParent(string strValue1, string strValue2)
        {
            List<ProductModelservices> _list = new List<ProductModelservices>();
            try
            {
                string free_products = string.Empty;

                ProductModelservices productsModel = new ProductModelservices();
                string strWhr = string.Empty;

                if (string.IsNullOrEmpty(strValue1) && string.IsNullOrEmpty(strValue2))
                {

                }
                else
                {
                    if (!string.IsNullOrEmpty(strValue1)) 
                        strWhr += " component_product_id = " + strValue1;
                    string strSQl = "SELECT distinct case when wp.post_parent = 0 then wp.ID else post_parent end ID,wp.post_title,post_title title,component_quantity qty"
                                + " FROM erp_product_component p"
                                + "  left outer join wp_posts wp on wp.ID = p.product_id"
                                + " WHERE " + strWhr;


                    strSQl += ";";
                    SqlDataReader sdr = SQLHelper.ExecuteReader(strSQl);
                    while (sdr.Read())
                    {
                        productsModel = new ProductModelservices();
                        if (sdr["ID"] != DBNull.Value)
                            productsModel.ID = Convert.ToInt64(sdr["ID"]);
                        else
                            productsModel.ID = 0;

                        productsModel.qty = Convert.ToInt32(sdr["qty"]);
                        productsModel.product_label = sdr["title"].ToString();
                        if (sdr["post_title"] != DBNull.Value)
                            productsModel.product_name = sdr["post_title"].ToString();
                        else
                            productsModel.product_name = string.Empty;

                        _list.Add(productsModel);
                    }
                }
            }
            catch (Exception ex)
            { throw ex; }
            return _list;
        }


        public static int UpdateComponentChildvariations(List<ProductChildModel> model)
        {
            int result = 0;
            try
            {
                string strSql_insert = string.Empty;
                StringBuilder strSql = new StringBuilder();
                foreach (ProductChildModel obj in model)
                {
                    if (obj.qty == 0)
                        strSql.Append("delete from erp_product_component where product_id =" + obj.fk_product + " and rowid =" + obj.fk_product_fils + ";");
                    else
                        strSql.Append(string.Format("update erp_product_component set component_quantity = '{0}' where rowid = '{1}' and product_id = '{2}' ; ", obj.qty, obj.fk_product_fils, obj.fk_product));
 
                }
                result = SQLHelper.ExecuteNonQueryWithTrans(strSql.ToString());
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Product/UpdateChildvariations/" + "0" + "", "Update Product Free Quantity");
            }
            return result;
        }

        public int UpdateproductcomponentStatus(AccountingJournalModel model)
        {
            //try
            //{
                //string strsql = "";
                //strsql = "Update erp_product_component set status=@status where rowid=@ID;";
                //SqlParameter[] para =
                //{
                //    new SqlParameter("@ID", model.rowid),
                //    new SqlParameter("@status", model.active),
                //};
                //int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                //return result;

                int result = 0;
                try
                {
                    string strSql_insert = string.Empty;
                    StringBuilder strSql = new StringBuilder();
                    //foreach (ProductChildModel obj in model)
                    //{
                    //    strSql.Append("Insert into erp_product_component(product_id,component_product_id,component_quantity) values(" + obj.fk_product + ",'" + obj.fk_product_fils + "','" + obj.qty + "');");
                    //}
                    //result = SQLHelper.ExecuteNonQueryWithTrans(strSql.ToString());
                    string res = string.Empty;
                     
                        SqlParameter[] parameters =
                   {
                     new SqlParameter("@ID", model.rowid),
                    new SqlParameter("@status", model.active),
                 };
                        res = SQLHelper.ExecuteScalar("erp_updateproductcomponent", parameters).ToString();
                // result = 1;            
                // string 
                if (res.StartsWith("Success"))
                    result = 1;
                //else
                //    result = 0;


            }
            catch (Exception Ex)
            {
                throw Ex;
            }
            return result;
        }

        public static DataTable Getproducttype()
        {
            DataTable DT = new DataTable();
            try
            {
                string strSQl = "select  rowid,product_type_name name from erp_product_type";
                DT = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        } 
        public static DataTable GetProductList(string strValue1, string userstatus, string strValue3, string strValue4, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "ID", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                SqlParameter[] parameters =
               {

                    new SqlParameter("@post_status", userstatus),
                   new SqlParameter("@searchcriteria", searchid),
                    new SqlParameter("@strValue1", strValue1),
                    new SqlParameter("@strValue3", strValue3),
                    new SqlParameter("@strValue4", strValue4),
                    new SqlParameter("@pageno", pageno),
                    new SqlParameter("@pagesize", pagesize),
                    new SqlParameter("@sortcol", SortCol),
                    new SqlParameter("@sortdir", SortDir),
                    new SqlParameter("@flag", "LST")
                };

                DataSet ds = SQLHelper.ExecuteDataSet("cms_product_search", parameters);
                dt = ds.Tables[0];
                if (ds.Tables[1].Rows.Count > 0)
                    totalrows = Convert.ToInt32(ds.Tables[1].Rows[0]["TotalRecord"].ToString());
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataTable GetProductCategory(string flag, int entity_id,long product_id)
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
                {

                    new SqlParameter("@entity_id", entity_id),
                    new SqlParameter("@id", product_id),
                    new SqlParameter("@flag", flag)
                };

                dt = SQLHelper.ExecuteDataTable("bulk_editor_master_search", parameters);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataTable GetTaxonomyTerms(string taxonomy, string query)
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@taxonomy", taxonomy),
                    new SqlParameter("@query", query),
                };
                string sqlQuery = "SELECT top 50 tt1.term_taxonomy_id,tt1.term_id,tt2.name,tt2.slug " +
                          "FROM wp_term_taxonomy tt1 INNER JOIN wp_terms tt2 on tt2.term_id = tt1.term_id " +
                          "WHERE tt1.taxonomy = @taxonomy"; 
                if (!string.IsNullOrEmpty(query))
                {
                    sqlQuery += " AND tt2.name LIKE '%' + @query + '%'";
                } 
                sqlQuery += " ORDER BY name";
                dt = SQLHelper.ExecuteDataTable(sqlQuery, parameters);
                //dt = SQLHelper.ExecuteDataTable("SELECT top 50 tt1.term_taxonomy_id,tt1.term_id,tt2.name,tt2.slug FROM wp_term_taxonomy tt1 INNER JOIN wp_terms tt2 on tt2.term_id = tt1.term_id WHERE tt1.taxonomy = @taxonomy and tt2.name like '%@query%' order by name", parameters);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        /// <summary>
        /// AttributesList
        /// </summary>
        /// <param name="id"></param>
        /// <param name="userstatus"></param>
        /// <param name="searchid"></param>
        /// <param name="pageno"></param>
        /// <param name="pagesize"></param>
        /// <param name="totalrows"></param>
        /// <param name="SortCol"></param>
        /// <param name="SortDir"></param>
        /// <returns></returns>
        public static DataTable AttributesList(long id, string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strSQl = "bulk_editor_master_search";
                SqlParameter[] para =
                {
                    new SqlParameter("@Flag", "attributes-tab")
                };
                dt = SQLHelper.ExecuteDataTable(strSQl, para);

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataTable GetAttributesByID(long id)
        {
            DataTable dt = new DataTable();
            try
            {
                string strWhr = string.Empty;
                string strSql = "erp_productattributes";
                SqlParameter[] para =
               {
                    new SqlParameter("@Flag", "show"),
                    new SqlParameter("@attribute_id", id)
                    };
                DataSet ds = SQLHelper.ExecuteDataSet(strSql, para);
                dt = ds.Tables[0];
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataTable GeteditAttributesByID(string flag, string taxonomy, long term_id)
        {
            DataTable dt = new DataTable();
            try
            {
                string strWhr = string.Empty;
                string strSql = "bulk_editor_attribute";
                SqlParameter[] para =
               {
                    new SqlParameter("@flag", flag),
                    new SqlParameter("@taxonomy", taxonomy),
                    new SqlParameter("@term_id", term_id),
                    };
                DataSet ds = SQLHelper.ExecuteDataSet(strSql, para);
                dt = ds.Tables[0];
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataTable GetCategoryList(string strValue1, string userstatus, string strValue3, string strValue4, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "ID", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                SqlParameter[] parameters =
               {

                    new SqlParameter("@post_status", userstatus),
                   new SqlParameter("@searchcriteria", searchid),
                    new SqlParameter("@strValue1", strValue1),
                    new SqlParameter("@strValue3", strValue3),
                    new SqlParameter("@strValue4", strValue4),
                    new SqlParameter("@pageno", pageno),
                    new SqlParameter("@pagesize", pagesize),
                    new SqlParameter("@sortcol", SortCol),
                    new SqlParameter("@sortdir", SortDir),
                    new SqlParameter("@flag", "LST")
                };

                DataSet ds = SQLHelper.ExecuteDataSet("cms_productcategoty_search", parameters);
                dt = ds.Tables[0];
                if (ds.Tables[1].Rows.Count > 0)
                    totalrows = Convert.ToInt32(ds.Tables[1].Rows[0]["TotalRecord"].ToString());
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataTable GetParentCategorylist(string term_taxonomy_id)
        {
            DataTable DS = new DataTable();
            try
            {

                string strSQl = "cms_productcategoty_search";
                SqlParameter[] para =
                {
                    new SqlParameter("@Flag", "LSTS")
                };
                DS = SQLHelper.ExecuteDataTable(strSQl, para);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }

        public static DataTable ImportProduct(string postsJSON, string flag = "PRODUCT")
        {
            var dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@json", postsJSON),
                    new SqlParameter("@flag", flag)
                };
                dt = SQLHelper.ExecuteDataTable("erp_product_import", parameters);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return dt;
        }

        public static DataTable GetProductById(string id)
        {
            var dt = new DataTable();
            try
            {
                string query = "select taglotserialno,fk_vendor,minpurchasequantity,purchase_price,salestax,shipping_price,Misc_Costs,cost_price,discount,remark from Product_Purchase_Items where fk_product = '" + id + "'";
                dt = SQLHelper.ExecuteDataTable(query);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return dt;
        }

        public static DataTable GetProductList(string id)
        {
            var dt = new DataTable();
            try
            {
                string query = "select taglotserialno,v.name vendor,post_title product,minpurchasequantity,purchase_price,salestax,shipping_price,Misc_Costs,cost_price,ppi.discount,remark " +
                                "from Product_Purchase_Items ppi" +
                                " left join wp_vendor v on v.rowid = ppi.fk_vendor" +
                                " left join wp_posts p on p.Id = ppi.fk_product where fk_product ='" + id + "'";
                dt = SQLHelper.ExecuteDataTable(query);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return dt;
        }

        public static int UpdateProduct(ProductByingPrice obj)
        {
            int result = 0;
            string query = "update Product_Purchase_Items set taglotserialno='" + obj.taglotserialno + "',minpurchasequantity = '" + obj.minpurchasequantity + "',purchase_price = '" + obj.purchase_price + "'," +
                           "salestax = '" + obj.salestax + "', shipping_price = '" + obj.shipping_price + "',Misc_Costs = '" + obj.Misc_Costs + "',cost_price = '" + obj.cost_price + "',discount = '" + obj.discount + "',remark ='" + obj.remark + "',taxrate = '" + obj.taxrate + "',fk_vendor = '" + obj.fk_vendor + "' where fk_product ='" + obj.fk_product + "'";
            string n = SQLHelper.ExecuteNonQuery(query).ToString();
            result = Convert.ToInt32(n);
            return result;
        }
        public static DataTable GetProductMargin(string strValue1, string userstatus, string strValue3, string strValue4, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "ID", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                SqlParameter[] parameters =
               {

                    new SqlParameter("@post_status", userstatus),
                   new SqlParameter("@searchcriteria", searchid),
                    new SqlParameter("@strValue1", strValue1),
                    new SqlParameter("@strValue3", strValue3),
                    new SqlParameter("@strValue4", strValue4),
                    new SqlParameter("@pageno", pageno),
                    new SqlParameter("@pagesize", pagesize),
                    new SqlParameter("@sortcol", SortCol),
                    new SqlParameter("@sortdir", SortDir),
                    new SqlParameter("@flag", "LST")
                };

                DataSet ds = SQLHelper.ExecuteDataSet("erp_productmargin_search", parameters);
                dt = ds.Tables[0];
                if (ds.Tables[1].Rows.Count > 0)
                    totalrows = Convert.ToInt32(ds.Tables[1].Rows[0]["TotalRecord"].ToString());
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataSet getvariationdetailsbyid(OrderPostStatusModel model)
        {
            DataSet ds = new DataSet();
            try
            {
                string strWhr = string.Empty;
                SqlParameter[] para = { new SqlParameter("@strVal", model.strVal), };
                string strSql = "cms_getvariationdetailsbyid";

                ds = SQLHelper.ExecuteDataSet(strSql, para);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }

        public static DataTable AddCategoriesImg(string qflag, string ID, string FileName, string entity_id, string height, string width, string file_size, string FileExtension, string thumbFileName, string mediumfilename, string largefilename, string post_title)
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] para = {
                    new SqlParameter("@qflag",qflag),
                    new SqlParameter("@ID", ID),
                    new SqlParameter("@file_name",FileName),
                     new SqlParameter("@entity_id",entity_id),
                     new SqlParameter("@height",height),
                     new SqlParameter("@width",width),
                     new SqlParameter("@file_size ",file_size),
                     new SqlParameter("@FileExtension ",FileExtension),
                     new SqlParameter("@thumb_file_name  ",thumbFileName),
                     new SqlParameter("@medium_file_name ",mediumfilename),
                     new SqlParameter("@large_file_name ",largefilename),
                     new SqlParameter("@post_title ",post_title)
                };
                dt = SQLHelper.ExecuteDataTable("cms_media_add", para);
                return dt;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }


        public int AddProductCategoryWithImage(ProductCategoryModel model)
        {

            try
            {
                string strsql = "";
                strsql = "erp_ProductCategoryNew";
                SqlParameter[] para =
                {
                    new SqlParameter("@Flag", "AddProductCategory"),
                    new SqlParameter("@name", model.name),
                    new SqlParameter("@slug",  Regex.Replace(model.slug, @"\s+", "-")),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }

        }

        public int AddProductCategoryDescWithImage(ProductCategoryModel model, int term_id)
        {
            string strsql = "";
            strsql = "erp_ProductCategoryNew";
            SqlParameter[] para =
            {
                    new SqlParameter("@Flag", "AddProductCategoryDescription"),
                    new SqlParameter("@term_id", term_id),
                    new SqlParameter("@taxonomy", "product_cat"),
                    new SqlParameter("@parent", model.parent),
                    new SqlParameter("@description", model.description == null ? "" : model.description),
                    new SqlParameter("@banner_id", model.banner_id),
                    new SqlParameter("@thumbnail_id",model.thumbnail_id),

                };
            int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
            return result;
        }

        public int EditAddProductCategoryWithImage(ProductCategoryModel model)
        {
            try
            {
                string strsql = "";
                strsql = "erp_ProductCategoryNew";
                SqlParameter[] para =
               {
                    new SqlParameter("@Flag", "EditProductCategory"),
                    new SqlParameter("@term_id", model.term_id),
                     new SqlParameter("@name", model.name),
                    new SqlParameter("@slug",  Regex.Replace(model.slug, @"\s+", "-")),
                    new SqlParameter("@parent", model.parent),
                    new SqlParameter("@description", model.description == null ? "" : model.description),
                    new SqlParameter("@banner_id", model.banner_id),
                    new SqlParameter("@thumbnail_id",model.thumbnail_id),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;


            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static DataTable GetProductVariantID(int ProductID)
        {
            DataTable dtr = new DataTable();
            try
            {
                string strquery = "SELECT ID,Post_title+'-'+ CONVERT(varchar,ID)  Post_title from wp_posts WHERE post_status = 'publish' and post_parent = " + ProductID + "";
                dtr = SQLHelper.ExecuteDataTable(strquery);
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        public static DataTable GetcategoriesMedia(JqDataTableModel model )
        {
            DataTable dt = new DataTable();
            string strquery = "select (select count(post_id) Total from cms_postmeta pm where meta_key='_file_name') Total, meta_value file_name,post_id ID from cms_postmeta pm where meta_key='_file_name' ORDER BY meta_id desc OFFSET " + model.iDisplayStart + " ROWS  FETCH NEXT  "+model.iSortCol_0 + " ROWS ONLY  ";
            dt = SQLHelper.ExecuteDataTable(strquery);
            return dt;
        }
        
        public static DataTable Searchcategories(JqDataTableModel model )
        {
            DataTable dt = new DataTable();
            string strquery = "select (select count(post_id) Total from cms_postmeta pm where meta_key='_file_name' and (meta_value like '%"+ model.strValue1 + "%' or post_id like '" + model.strValue1 + "%' or meta_value like '" + model.strValue1 + "%')) Total, meta_value img,post_id ID from cms_postmeta pm where meta_key='_file_name' and (meta_value like '%" + model.strValue1 + "%' or post_id like '" + model.strValue1 + "%' or meta_value like '" + model.strValue1 + "%') ORDER BY meta_id desc OFFSET " + model.strValue2+ " ROWS  FETCH NEXT  "+model.strValue3+ " ROWS ONLY  ";
            dt = SQLHelper.ExecuteDataTable(strquery);
            return dt;
        }

        public static DataTable ImportAttributesProduct(string postsJSON, string flag = "PRODUCT")
        {
            var dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@json", postsJSON),
                    new SqlParameter("@flag", flag)
                };
                dt = SQLHelper.ExecuteDataTable("erp_productAttributes_import", parameters);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return dt;
        }

        public static void UpdateattributMetaData(ProductModel model, long id, string varFieldsName, string varFieldsValue,string term_taxonomy,string term_taxonomy_id)
        {
            try
            {
                string strsql = "erp_productattributes_iud";
                SqlParameter[] para =
                {
                    new SqlParameter("@qflag", "UM"),
                    new SqlParameter("@post_id", id),
                    new SqlParameter("@meta_key", varFieldsName),
                    new SqlParameter("@meta_value", varFieldsValue),
                    new SqlParameter("@term_taxonomy", term_taxonomy),
                    new SqlParameter("@term_taxonomy_id", term_taxonomy_id),
                };
                SQLHelper.ExecuteNonQuery(strsql, para);
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Product/CreateProduct/" + id + "", "Product Update Meta Data Details");
                throw Ex;
            }
        }

        public static DataTable GetTermShipping()
        {
            DataTable DT = new DataTable();
            try
            {
                string strSQl = "select term_taxonomy_id rowid,name   from wp_term_taxonomy  wtt inner join wp_terms wt on wt.term_id = wtt.term_id where  taxonomy  = 'product_shipping_class'";
                DT = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }

        public static void Add_termproducttype(int TermID, int ID)
        {
            try
            {
                string strsql = "erp_product_iud";
                SqlParameter[] para =
                {
                    new SqlParameter("@qflag", "IPT"),
                    new SqlParameter("@object_id", ID),
                    new SqlParameter("@term_taxonomy_id", TermID),
                    new SqlParameter("@term_order", "0")

                };
                SQLHelper.ExecuteScalar(strsql, para);
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Product/update_term/" + ID + "", "Add Term Product");
                throw Ex;
            }
        }



    }
}