﻿using LaylaERP.DAL;
using LaylaERP.Models;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Http.Results;
using System.Web.Mvc;


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
        public static DataTable GetDataByID(OrderPostStatusModel model)
        {
            DataTable dt = new DataTable();

            try
            {
                string strWhr = string.Empty;

                string strSql = "SELECT P.ID ID,post_title,post_content,post_name,guid,ifnull(thumbnails,'default.png') thumbnails,ifnull(image,'default.png') image,pmgiftcard.meta_value giftcard,pmexpday.meta_value expirationdayes,pmtemlatimage.meta_value gifttemplate,"
                             + "  DATE_FORMAT(P.post_modified,'%m/%d/%Y') Publish_Date,pmregularamount.meta_value regularamount,pmsaleprice.meta_value saleprice,pmtotalsales.meta_value totalsales,pmtaxstatus.meta_value axstatus,pmtaxclass.meta_value taxclass,pmmanagestock.meta_value managestock,pmsoldindividually.meta_value soldindividually,"
                             + "  pmbackorders.meta_value backorders,pmweight.meta_value weight,pmlength.meta_value length,pmeheight.meta_value height,pmwidth.meta_value width,pmupsellids.meta_value upsellids,pmcrosssellids.meta_value crosssellids,"
                             + "  pmstock.meta_value stock,pmstockstatus.meta_value stockstatus,pmlowstockamount.meta_value lowstockamount, pmsku.meta_value sku,pmsatt.meta_value productattributes,(SELECT group_concat(ID) FROM `wp_posts` where post_parent = P.ID) VariantID,"
                             + " (select term_id  from wp_terms where term_id in ( select term_id from wp_term_taxonomy where taxonomy = 'product_type' and term_taxonomy_id in (SELECT term_taxonomy_id FROM `wp_term_relationships` where object_id = P.ID))) ProductsID,"
                             + " (select term_id from wp_terms where term_id in ( select term_id from wp_term_taxonomy where taxonomy = 'product_shipping_class' and term_taxonomy_id in (SELECT term_taxonomy_id FROM `wp_term_relationships` where object_id = P.ID))) shippingclass, (select fk_shippingID from Shipping_Product where fk_productid = P.ID limit 1) shippingclassID,"
                             + " (select group_concat(term_id) from wp_terms where term_id in ( select term_id from wp_term_taxonomy where taxonomy = 'product_cat' and term_taxonomy_id in ( SELECT term_taxonomy_id FROM `wp_term_relationships` where object_id =  P.ID))) CategoryID"
                             + " FROM wp_posts P"
                             + " left join wp_postmeta pmregularamount on P.ID = pmregularamount.post_id and pmregularamount.meta_key = '_regular_price'"
                             + " left join wp_postmeta pmsaleprice on P.ID = pmsaleprice.post_id and pmsaleprice.meta_key = '_sale_price'"
                             + " left join wp_postmeta pmtotalsales on P.ID = pmtotalsales.post_id and pmtotalsales.meta_key = 'total_sales'"
                             + " left join wp_postmeta pmtaxstatus on P.ID = pmtaxstatus.post_id and pmtaxstatus.meta_key = '_tax_status'"
                             + " left join wp_postmeta pmtaxclass on P.ID = pmtaxclass.post_id and pmtaxclass.meta_key = '_tax_class'"
                             + " left join wp_postmeta pmmanagestock on P.ID = pmmanagestock.post_id and pmmanagestock.meta_key = '_manage_stock'"
                             + " left join wp_postmeta pmbackorders on P.ID = pmbackorders.post_id and pmbackorders.meta_key = '_backorders'"
                             + " left join wp_postmeta pmsoldindividually on P.ID = pmsoldindividually.post_id and pmsoldindividually.meta_key = '_sold_individually'"
                             + " left join wp_postmeta pmweight on P.ID = pmweight.post_id and pmweight.meta_key = '_weight'"
                             + " left join wp_postmeta pmlength on P.ID = pmlength.post_id and pmlength.meta_key = '_length'"
                             + " left join wp_postmeta pmwidth on P.ID = pmwidth.post_id and pmwidth.meta_key = '_width'"
                             + " left join wp_postmeta pmeheight on P.ID = pmeheight.post_id and pmeheight.meta_key = '_height'"
                             + " left join wp_postmeta pmupsellids on P.ID = pmupsellids.post_id and pmupsellids.meta_key = '_upsell_ids'"
                             + " left join wp_postmeta pmcrosssellids on P.ID = pmcrosssellids.post_id and pmcrosssellids.meta_key = '_crosssell_ids'"
                             + " left join wp_postmeta pmstock on P.ID = pmstock.post_id and pmstock.meta_key = '_stock'"
                             + " left join wp_postmeta pmstockstatus on P.ID = pmstockstatus.post_id and pmstockstatus.meta_key = '_stock_status'"
                             + " left join wp_postmeta pmlowstockamount on P.ID = pmlowstockamount.post_id and pmlowstockamount.meta_key = '_low_stock_amount'"
                             + " left join wp_postmeta pmsku on P.ID = pmsku.post_id and pmsku.meta_key = '_sku'"
                             + " left join wp_postmeta pmsatt on P.ID = pmsatt.post_id and pmsatt.meta_key = '_product_attributes'"
                             + " left join wp_postmeta pmgiftcard on P.ID = pmgiftcard.post_id and pmgiftcard.meta_key = '_gift_card'"
                             + " left join wp_postmeta pmexpday on P.ID = pmexpday.post_id and pmexpday.meta_key = '_gift_card_expiration_days'"
                             + " left join wp_postmeta pmtemlatimage on P.ID = pmtemlatimage.post_id and pmtemlatimage.meta_key = '_gift_card_template_default_use_image'"
                             + " left join wp_image wpimg on wpimg.id = P.ID "
                             + " WHERE P.post_type in ('product','product_variation') and P.ID = " + model.strVal + " ";


                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dt = ds.Tables[0];

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataTable GetDataBuyingByID(OrderPostStatusModel model)
        {
            DataTable dt = new DataTable();

            try
            {
                string strWhr = string.Empty;

                string strSql = "SELECT rowid ID,fk_vendor,purchase_price,cost_price,minpurchasequantity,salestax,taxrate,discount,remark,taglotserialno,shipping_price,Misc_Costs from Product_Purchase_Items"
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
                    if (!string.IsNullOrEmpty(strValue1))
                        strWhr += " and pp.post_title like '%" + strValue1 + "%' ";

                    if (!string.IsNullOrEmpty(strValue2))
                        strWhr += " and t.term_id = " + strValue2;


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

                    string strSQl = "select distinct case when  pp.post_parent is null then p.ID else pp.ID end ID,t.term_id,case when  pp.post_parent is null then p.post_title else pp.post_title end post_title,case when  pp.post_parent is null then p.post_title else pp.post_title end title,t.name AS product_category"
                     + " FROM wp_posts p"
                     + "  LEFT JOIN wp_posts AS pp ON pp.post_parent = p.ID and pp.post_status = 'publish'"
                     + "  LEFT JOIN wp_term_relationships AS tr ON tr.object_id = p.ID"
                     + "  LEFT JOIN wp_term_taxonomy AS tt ON tt.term_taxonomy_id = tr.term_taxonomy_id"
                     + "  JOIN wp_terms AS t ON t.term_id = tt.term_id"
                     + " WHERE p.post_type in('product','product_variation') and tt.taxonomy IN('product_cat','product_type') and p.post_status = 'publish' " + strWhr;

                    strSQl += ";";
                    MySqlDataReader sdr = SQLHelper.ExecuteReader(strSQl);
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
                    string strSQl = "SELECT distinct free_product_id ID,wp.post_title,post_title title,ifnull((SELECT min(FORMAT(purchase_price,2)) purchase_price from Product_Purchase_Items where fk_product = p.free_product_id),'0.00') buyingprice,ifnull(FORMAT(pmsaleprice.meta_value,2),'0.00') sellingpric,0 Stock ,free_quantity qty"
                                + " FROM wp_product_free p"
                                + "  left outer join wp_posts wp on wp.ID = p.free_product_id"
                                + "  left join wp_postmeta pmsaleprice on wp.ID = pmsaleprice.post_id and pmsaleprice.meta_key = '_sale_price'"
                                + "  WHERE wp.post_type in('product','product_variation') " + strWhr;


                    strSQl += ";";
                    MySqlDataReader sdr = SQLHelper.ExecuteReader(strSQl);
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
                MySqlParameter[] para =
                {
                    new MySqlParameter("@status", model.status),
                   // new MySqlParameter("@post_modified", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")),
                    new MySqlParameter("@post_modified_gmt", DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss"))
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
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
                    MySqlDataReader sdr = SQLHelper.ExecuteReader(strSQl);
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
                        strWhr += " fk_product = " + strValue1;
                    string strSQl = "SELECT ppi.rowid,name,minpurchasequantity,FORMAT(salestax,2) salestax,FORMAT(purchase_price, 2) purchase_price,FORMAT(cost_price, 2) cost_price,FORMAT(shipping_price, 2) shipping_price,FORMAT(Misc_Costs, 2) Misc_Costs,DATE_FORMAT(date_inc, '%m-%d-%Y') date_inc,ppi.discount,taglotserialno,case when is_active = 1 then 'Active' else 'InActive' end as Status"
                                + " FROM Product_Purchase_Items ppi"
                                + " left outer JOIN wp_vendor wpv on wpv.rowid = ppi.fk_vendor"
                                + " WHERE" + strWhr;

                    strSQl += ";";
                    MySqlDataReader sdr = SQLHelper.ExecuteReader(strSQl);
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

                string strSql = "SELECT count(distinct Filename) filecount, P.ID ID,post_title,FORMAT(pmregularamount.meta_value,2) regularamount,FORMAT(pmsaleprice.meta_value,2) saleprice,min( FORMAT(purchase_price,2)) purchase_price,min(FORMAT(cost_price,2)) cost_price,(select name from wp_vendor where rowid = (select fk_vendor from Product_Purchase_Items where fk_product = " + model.strVal + " and cost_price = (SELECT MIN(cost_price) FROM Product_Purchase_Items WHERE fk_product = " + model.strVal + ")LIMIT 1)) vname,pmsku.meta_value sku,pmpublic.meta_value Public_Notes,pmprivate.meta_value Private_Notes"
                             + " FROM wp_posts P"
                             + " left join wp_postmeta pmregularamount on P.ID = pmregularamount.post_id and pmregularamount.meta_key = '_regular_price'"
                             + " left join wp_postmeta pmsaleprice on P.ID = pmsaleprice.post_id and pmsaleprice.meta_key = '_sale_price'"
                             + " left join wp_postmeta pmprivate on P.ID = pmprivate.post_id and pmprivate.meta_key = 'Private_Notes'"
                             + " left join wp_postmeta pmpublic on P.ID = pmpublic.post_id and pmpublic.meta_key = 'Public_Notes'"
                             + " left join Product_Purchase_Items on Product_Purchase_Items.fk_product = P.ID and is_active=1"
                             + " left join product_linkedfiles plf on plf.fk_product = P.ID"
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
        public static DataTable GetDataVariationByID(OrderPostStatusModel model)
        {
            DataTable dt = new DataTable();

            try
            {
                string strWhr = string.Empty;

                //string strSql = "SELECT P.ID ID,post_title,post_content,post_name,"
                //             + "  pmregularamount.meta_value regularamount,pmsaleprice.meta_value saleprice,pmtotalsales.meta_value totalsales,pmtaxstatus.meta_value axstatus,pmtaxclass.meta_value taxclass,pmmanagestock.meta_value managestock,pmsoldindividually.meta_value soldindividually,"
                //             + "  pmbackorders.meta_value backorders,pmweight.meta_value weight,pmlength.meta_value length,pmeheight.meta_value height,pmwidth.meta_value width,pmupsellids.meta_value upsellids,pmcrosssellids.meta_value crosssellids,"
                //             + "  pmstock.meta_value stock,pmstockstatus.meta_value stockstatus,pmlowstockamount.meta_value lowstockamount, pmsku.meta_value sku,pmsatt.meta_value productattributes,(SELECT group_concat(ID) FROM `wp_posts` where post_parent = P.ID) VariantID,"
                //             + " (select term_id  from wp_terms where term_id in ( select term_id from wp_term_taxonomy where taxonomy = 'product_type' and term_taxonomy_id in (SELECT term_taxonomy_id FROM `wp_term_relationships` where object_id = P.ID))) ProductsID,"
                //             + " (select term_id from wp_terms where term_id in ( select term_id from wp_term_taxonomy where taxonomy = 'product_shipping_class' and term_taxonomy_id in (SELECT term_taxonomy_id FROM `wp_term_relationships` where object_id = P.ID))) shippingclass,"
                //             + " (select group_concat(term_id) from wp_terms where term_id in ( select term_id from wp_term_taxonomy where taxonomy = 'product_cat' and term_taxonomy_id in ( SELECT term_taxonomy_id FROM `wp_term_relationships` where object_id =  P.ID))) CategoryID"
                //             + " FROM wp_posts P"
                //             + " left join wp_postmeta pmregularamount on P.ID = pmregularamount.post_id and pmregularamount.meta_key = '_regular_price'"
                //             + " left join wp_postmeta pmsaleprice on P.ID = pmsaleprice.post_id and pmsaleprice.meta_key = '_sale_price'"
                //             + " left join wp_postmeta pmtotalsales on P.ID = pmtotalsales.post_id and pmtotalsales.meta_key = 'total_sales'"
                //             + " left join wp_postmeta pmtaxstatus on P.ID = pmtaxstatus.post_id and pmtaxstatus.meta_key = '_tax_status'"
                //             + " left join wp_postmeta pmtaxclass on P.ID = pmtaxclass.post_id and pmtaxclass.meta_key = '_tax_class'"
                //             + " left join wp_postmeta pmmanagestock on P.ID = pmmanagestock.post_id and pmmanagestock.meta_key = '_manage_stock'"
                //             + " left join wp_postmeta pmbackorders on P.ID = pmbackorders.post_id and pmbackorders.meta_key = '_backorders'"
                //             + " left join wp_postmeta pmsoldindividually on P.ID = pmsoldindividually.post_id and pmsoldindividually.meta_key = '_sold_individually'"
                //             + " left join wp_postmeta pmweight on P.ID = pmweight.post_id and pmweight.meta_key = '_weight'"
                //             + " left join wp_postmeta pmlength on P.ID = pmlength.post_id and pmlength.meta_key = '_length'"
                //             + " left join wp_postmeta pmwidth on P.ID = pmwidth.post_id and pmwidth.meta_key = '_width'"
                //             + " left join wp_postmeta pmeheight on P.ID = pmeheight.post_id and pmeheight.meta_key = '_height'"
                //             + " left join wp_postmeta pmupsellids on P.ID = pmupsellids.post_id and pmupsellids.meta_key = '_upsell_ids'"
                //             + " left join wp_postmeta pmcrosssellids on P.ID = pmcrosssellids.post_id and pmcrosssellids.meta_key = '_crosssell_ids'"
                //             + " left join wp_postmeta pmstock on P.ID = pmstock.post_id and pmstock.meta_key = '_stock'"
                //             + " left join wp_postmeta pmstockstatus on P.ID = pmstockstatus.post_id and pmstockstatus.meta_key = '_stock_status'"
                //             + " left join wp_postmeta pmlowstockamount on P.ID = pmlowstockamount.post_id and pmlowstockamount.meta_key = '_low_stock_amount'"
                //             + " left join wp_postmeta pmsku on P.ID = pmsku.post_id and pmsku.meta_key = '_sku'"
                //             + " left join wp_postmeta pmsatt on P.ID = pmsatt.post_id and pmsatt.meta_key = '_product_attributes'"
                //             + " WHERE P.post_type = 'product_variation' and P.ID = " + model.strVal + " ";
                string strSql = "SELECT p.id,p.post_title,p.post_content,p.post_name,case when guid = '' then 'default.png' else ifnull(guid,'default.png') end guid,concat('{', group_concat(concat('\"',LOWER(pm.meta_key), '\": \"', pm.meta_value,'\"')), '}') meta_data,"
                        + " (SELECT fk_shippingID FROM Shipping_Product where fk_productid = p.ID) shippingclass,ifnull(thumbnails,'default.png') thumbnails,ifnull(image,'default.png') image"
                        + " FROM wp_posts p left outer join wp_postmeta pm on pm.post_id = p.id"
                        + " and(pm.meta_key in ('_regular_price', '_sale_price', 'total_sales', '_tax_status', '_tax_class', '_manage_stock', '_backorders', '_sold_individually',"
                        + " '_weight', '_length', '_width', '_height', '_upsell_ids', '_crosssell_ids', '_stock', '_low_stock_amount', '_sku', '_product_attributes','_variation_description','_allowwebsite')"
                        + " or meta_key like 'Attribute_%') left join wp_image wpimg on wpimg.id = p.ID"
                        + " where p.post_type = 'product_variation' and p.post_parent = " + model.strVal + " group by p.id,p.post_title,p.post_content,p.post_name order by p.id";

                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
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
                MySqlParameter[] para =
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
                string strsql = "insert into Shipping_class(Shippingclass_Name)values(@Shippingclass_Name);SELECT LAST_INSERT_ID();";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@Shippingclass_Name", model.Shippingclass_Name),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
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

                DT = SQLHelper.ExecuteDataTable("select distinct StateFullName,State from erp_StateList where Country = '" + country + "' and  (StateFullName like '" + strSearch + "%' or State like '" + strSearch + "%') order by StateFullName limit 50;");

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

                DT = SQLHelper.ExecuteDataTable("select distinct StateFullName,State from erp_StateList where Country = '" + country + "'  order by StateFullName limit 70;");

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
                    MySqlDataReader sdr = SQLHelper.ExecuteReader(strSQl);
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
                    string strSQl = "SELECT pw.rowid as ID,fk_product,Length,FileType,DATE_FORMAT(CreateDate, '%m-%d-%Y') CreateDate,FileName"
                                + " from product_linkedfiles pw"
                                + " WHERE " + strWhr;

                    strSQl += ";";
                    MySqlDataReader sdr = SQLHelper.ExecuteReader(strSQl);
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
                string strquery = "SELECT ID,Post_title FROM `wp_posts` WHERE post_status = 'publish' and post_parent = " + ProductID + "";
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


                string strSql = "select t.term_id,p.id,p.post_type,p.post_title,post_date_gmt,DATE_FORMAT(p.post_date_gmt, '%m-%d-%Y') Date,DATE_FORMAT(p.post_modified, '%m-%d-%Y') publishDate,case when guid = '' then 'default.png' else ifnull(guid,'default.png') end guid,ifnull(thumbnails,'default.png') thumbnails,"
              + " (select group_concat(ui.name) from wp_terms ui join wp_term_taxonomy uim on uim.term_id = ui.term_id and uim.taxonomy IN('product_cat') JOIN wp_term_relationships AS trp ON trp.object_id = p.ID and trp.term_taxonomy_id = uim.term_taxonomy_id) itemname ,"
              + " case when p.post_status = 'trash' then 'InActive' else 'Active' end Activestatus,max(case when p.id = s.post_id and s.meta_key = '_sku' then s.meta_value else '' end) sku,"
              + " max(case when p.id = s.post_id and s.meta_key = '_regular_price' then s.meta_value else '' end) regular_price, max(case when p.id = s.post_id and s.meta_key = '_sale_price' then s.meta_value else '' end) sale_price, "
              + " (case when p.post_parent = 0 then p.id else p.post_parent end) p_id,p.post_parent,p.post_status"
              + " FROM wp_posts p"
              + " left join wp_postmeta as s on p.id = s.post_id"
              + " LEFT JOIN wp_term_relationships AS tr ON tr.object_id = p.ID"
              + " LEFT JOIN wp_term_taxonomy AS tt ON tt.term_taxonomy_id = tr.term_taxonomy_id and taxonomy IN('product_type')"
              + " LEFT JOIN wp_terms AS t ON t.term_id = tt.term_id"
               + " left join wp_image wpimg on wpimg.id = p.ID"
              + " WHERE p.post_type in ('product', 'product_variation') and p.post_status != 'draft' " + strWhr
              + " GROUP BY p.ID"
               + " order by p_id";
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
                + " State,Method,format(Shipping_price,2) Shipping_price ,Type,taxable"
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

              + " order by " + SortCol + " " + SortDir + " limit " + (pageno).ToString() + ", " + pagesize + "";

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
                            + " GROUP BY p.ID limit 50;";
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
                string strsql = "Insert into wp_posts(post_date,post_date_gmt,post_content,post_excerpt,post_title,post_name,post_status,post_type,to_ping, pinged,post_content_filtered,post_mime_type,post_parent,ping_status,comment_status) values(@post_date,@post_date_gmt,@post_content,@post_excerpt,@post_title,@post_name,@post_status,@post_type,@to_ping, @pinged,@post_content_filtered,@post_mime_type,@post_parent,'closed',@comment_status);SELECT LAST_INSERT_ID();";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@post_date", DateTime.Now),
                    new MySqlParameter("@post_date_gmt", DateTime.UtcNow),
                    new MySqlParameter("@post_content", model.post_content),
                    new MySqlParameter("@post_excerpt", string.Empty),
                    new MySqlParameter("@post_title", model.post_title),
                    new MySqlParameter("@post_status", model.post_status),
                    new MySqlParameter("@post_type", model.post_type),
                    new MySqlParameter("@post_name", model.post_name),
                    new MySqlParameter("@to_ping", string.Empty),
                    new MySqlParameter("@pinged", string.Empty),
                    new MySqlParameter("@post_content_filtered", string.Empty),
                    new MySqlParameter("@post_mime_type", string.Empty),
                    new MySqlParameter("@post_parent", model.post_parent),
                    new MySqlParameter("@comment_status", model.comment_status),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public static int AddProductDetails(ProductModel model)
        {
            try
            {
                string strsql = "Insert into wp_posts(post_date,post_date_gmt,post_content,post_excerpt,post_title,post_name,post_status,post_type,to_ping, pinged,post_content_filtered,post_mime_type,post_parent,ping_status,comment_status,post_modified) values(@post_date,@post_date_gmt,@post_content,@post_excerpt,@post_title,@post_name,@post_status,@post_type,@to_ping, @pinged,@post_content_filtered,@post_mime_type,@post_parent,'closed',@comment_status,@post_modified);SELECT LAST_INSERT_ID();";

                MySqlParameter[] para =
                {
                    new MySqlParameter("@post_date", DateTime.Now),
                    new MySqlParameter("@post_date_gmt", DateTime.UtcNow),
                    new MySqlParameter("@post_content", model.post_content),
                    new MySqlParameter("@post_excerpt", string.Empty),
                    new MySqlParameter("@post_title", model.post_title),
                    new MySqlParameter("@post_status", model.post_status),
                    new MySqlParameter("@post_type", model.post_type),
                    new MySqlParameter("@post_name", model.post_name),
                    new MySqlParameter("@to_ping", string.Empty),
                    new MySqlParameter("@pinged", string.Empty),
                    new MySqlParameter("@post_content_filtered", string.Empty),
                    new MySqlParameter("@post_mime_type", string.Empty),
                    new MySqlParameter("@post_parent", model.post_parent),
                    new MySqlParameter("@comment_status", model.comment_status),
                    new MySqlParameter("@post_modified",model.PublishDate),

                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static int Addshippingdetails(ProductModel model)
        {
            try
            {
                string strsql = "Insert into Shipping_class(Shippingclass_Name) values(@Shippingclass_Name);SELECT LAST_INSERT_ID();";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@Shippingclass_Name", model.Shippingclass_Name),
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
                strSql.Append(string.Format("Insert into product_linkedfiles(fk_product,FileName,Length,FileType,FilePath) values(" + fk_product + ",'" + FileName + "','" + Length + "','" + FileType + "','" + FilePath + "');SELECT LAST_INSERT_ID();"));
                result = SQLHelper.ExecuteNonQuery(strSql.ToString());
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public static int EditProducts(ProductModel model, long ID)
        {
            try
            {
                string strsql = "update wp_posts set post_title=@post_title,post_name=@post_name, post_content=@post_content,post_type='product',post_status='publish',post_modified=@post_modified where ID =" + ID + "";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@post_content", model.post_content),
                    new MySqlParameter("@post_title", model.post_title),
                    new MySqlParameter("@post_name", model.post_name),
                    new MySqlParameter("@post_modified",model.PublishDate),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static int AddBuyingtProduct(ProductModel model, DateTime dateinc)
        {
            int result = 0;
            try
            {
                StringBuilder strSql = new StringBuilder();
                //StringBuilder strSql = new StringBuilder(string.Format("delete from Product_Purchase_Items where fk_product = {0}; ", model.fk_product));
                strSql.Append(string.Format("insert into Product_Purchase_Items ( fk_product,fk_vendor,purchase_price,cost_price,minpurchasequantity,salestax,taxrate,discount,remark,taglotserialno,shipping_price,Misc_Costs) values ({0},{1},{2},{3},{4},{5},{6},{7},'{8}','{9}',{10},{11}); ", model.fk_product, model.fk_vendor, model.purchase_price, model.cost_price, model.minpurchasequantity, model.salestax, model.taxrate, model.discount, model.remark, model.taglotserialno, model.shipping_price, model.Misc_Costs));
                //strSql.Append(string.Format("delete from product_warehouse where fk_product = {0}; ", model.fk_product));
                //strSql.Append(string.Format("update product_warehouse set is_active = 0 where fk_product = {0}; ", model.fk_product));
                // strSql.Append(string.Format("insert into product_warehouse(fk_product,fk_warehouse) (select '"+ model.fk_product + "',warehouseid from wp_VendorWarehouse where VendorID = "+ model.fk_vendor + ") "));
                /// step 6 : wp_posts
                //strSql.Append(string.Format(" update wp_posts set post_status = '{0}' ,comment_status = 'closed' where id = {1} ", model.OrderPostStatus.status, model.OrderPostStatus.order_id));

                result = SQLHelper.ExecuteNonQuery(strSql.ToString());
            }
            catch (Exception ex)
            { throw ex; }
            return result;
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
            { throw ex; }
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
            { throw ex; }
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
            { throw ex; }
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
            { throw ex; }
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
            catch { }
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
            { throw ex; }
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
            { throw ex; }
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
            { throw ex; }
            return result;
        }
        public static DataTable Getproductwarehouse(ProductModel model)
        {
            DataTable dt = new DataTable();
            try
            {
                string strSQl = "select fk_warehouse from product_warehouse"
                                + " WHERE fk_product = " + model.fk_product + " and fk_warehouse in (" + model.fk_vendor + ") "
                                + " limit 10;";
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
                                + " limit 10;";
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
                                + " limit 10;";
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
                                + " limit 10;";
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
                                + " limit 10;";
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
            { throw ex; }
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
            { throw ex; }
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
            { throw ex; }
            return result;
        }
        public static int UpdateProductsVariation(string post_title, string post_excerpt, long ID)
        {
            try
            {
                string strsql = "update wp_posts set post_title='" + post_title + "',post_excerpt='" + post_excerpt + "'  where ID =" + ID + "";
                MySqlParameter[] para =
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
                string strsql = "Insert into wp_postmeta(post_id,meta_key,meta_value) values(@post_id,@meta_key,@meta_value); select LAST_INSERT_ID() as ID;";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@post_id", id),
                    new MySqlParameter("@meta_key", varFieldsName),
                    new MySqlParameter("@meta_value", varFieldsValue),
                };
                SQLHelper.ExecuteNonQuery(strsql, para);
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public static void AddProductsMetaVariation(long id, string varFieldsName, string varFieldsValue)
        {
            try
            {
                string strsql = "Insert into wp_postmeta(post_id,meta_key,meta_value) values(@post_id,@meta_key,@meta_value); select LAST_INSERT_ID() as ID;";
                MySqlParameter[] para =
                {
                     new MySqlParameter("@post_id", id),
                     new MySqlParameter("@meta_key", varFieldsName),
                     new MySqlParameter("@meta_value", varFieldsValue),
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
            catch { }
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
                    strSql.Append("Insert into wp_term_relationships(object_id,term_taxonomy_id,term_order) values(" + obj.object_id + "," + obj.term_taxonomy_id + ",0);SELECT LAST_INSERT_ID();");
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
                    strSql.Append("Insert into Shipping_Product(fk_productid,fk_shippingID) values(" + obj.object_id + "," + obj.term_taxonomy_id + ");SELECT LAST_INSERT_ID();");

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
            catch { }
            return result;
        }
        public static void UpdateProductsMetaVariation(long id, string varFieldsName, string varFieldsValue)
        {
            try
            {
                string strsql = "update wp_postmeta set meta_value=@meta_value where post_id=@post_id and meta_key=@meta_key";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@post_id", id),
                    new MySqlParameter("@meta_key", varFieldsName),
                    new MySqlParameter("@meta_value", varFieldsValue),
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

                    strSql.Append("Insert into wp_postmeta(post_id,meta_key,meta_value) values(" + obj.post_id + ",'" + obj.meta_key + "','" + obj.meta_value + "');SELECT LAST_INSERT_ID();");
                    // strSql_insert += (strSql_insert.Length > 0 ? " union all " : "") + string.Format("select '{0}' post_id,'{1}' meta_key,'{2}' meta_value", obj.post_id, obj.meta_key, obj.meta_value);
                    //strSql.Append(string.Format("update wp_postmeta set meta_value = '{0}' where post_id = '{1}' and meta_key = '{2}' ; ", obj.meta_value, obj.post_id, obj.meta_key));
                }

                result = SQLHelper.ExecuteNonQueryWithTrans(strSql.ToString());
            }
            catch { }
            return result;
        }

        public static int Childvariations(List<ProductChildModel> model)
        {
            int result = 0;
            try
            {
                string strSql_insert = string.Empty;
                StringBuilder strSql = new StringBuilder();

                //foreach (ProductChildModel obj in model)
                //{
                //    strSql.Append("delete from product_association where fk_product =" + obj.fk_product + ";");
                //}

                foreach (ProductChildModel obj in model)
                {

                    // strSql.Append("Insert into product_association(fk_product,fk_product_fils,qty) values(" + obj.fk_product + ",'" + obj.fk_product_fils + "','" + obj.qty + "');SELECT LAST_INSERT_ID();");
                    strSql.Append("Insert into wp_product_free(product_id,free_product_id,free_quantity) values(" + obj.fk_product + ",'" + obj.fk_product_fils + "','" + obj.qty + "');SELECT LAST_INSERT_ID();");

                    // strSql_insert += (strSql_insert.Length > 0 ? " union all " : "") + string.Format("select '{0}' post_id,'{1}' meta_key,'{2}' meta_value", obj.post_id, obj.meta_key, obj.meta_value);
                    //strSql.Append(string.Format("update wp_postmeta set meta_value = '{0}' where post_id = '{1}' and meta_key = '{2}' ; ", obj.meta_value, obj.post_id, obj.meta_key));
                }

                result = SQLHelper.ExecuteNonQueryWithTrans(strSql.ToString());
            }
            catch { }
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
            catch { }
            return result;
        }


        public static void Add_term(int TermID, int ID)
        {
            try
            {
                string strsql = "Insert into wp_term_relationships(object_id,term_taxonomy_id,term_order) values(@object_id,@term_taxonomy_id,@term_order);SELECT LAST_INSERT_ID();";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@object_id", ID),
                    new MySqlParameter("@term_taxonomy_id", TermID),
                    new MySqlParameter("@term_order", "0")

                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));

            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }


        public static int update_count(int TermID, int ID)
        {
            int result = 0;
            try
            {
                string strSql_insert = string.Empty;
                StringBuilder strSql = new StringBuilder();
                strSql.Append(string.Format("update wp_term_taxonomy set count = count-1 where term_taxonomy_id = {0} ; ", TermID));
                result = SQLHelper.ExecuteNonQueryWithTrans(strSql.ToString());
            }
            catch { }
            return result;
        }

        public static int update_countinc(int TermID, int ID)
        {
            int result = 0;
            try
            {
                string strSql_insert = string.Empty;
                StringBuilder strSql = new StringBuilder();
                strSql.Append(string.Format("update wp_term_taxonomy set count = count+1 where term_taxonomy_id = {0} ; ", TermID));
                result = SQLHelper.ExecuteNonQueryWithTrans(strSql.ToString());
            }
            catch { }
            return result;
        }

        public static void Add_Shipping(int TermID, int ID)
        {
            try
            {
                //string strsql = "Insert into wp_term_relationships(object_id,term_taxonomy_id,term_order) values(@object_id,@term_taxonomy_id,@term_order);SELECT LAST_INSERT_ID();";
                //MySqlParameter[] para =
                //{
                //    new MySqlParameter("@object_id", ID),
                //    new MySqlParameter("@term_taxonomy_id", TermID),
                //    new MySqlParameter("@term_order", "0")

                //};
                //int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));

                StringBuilder strSql = new StringBuilder();
                strSql.Append("delete from Shipping_Product where fk_productid=" + ID + ";");
                strSql.Append("Insert into Shipping_Product(fk_productid,fk_shippingID) values(" + ID + "," + TermID + ");SELECT LAST_INSERT_ID();");


                int result = SQLHelper.ExecuteNonQueryWithTrans(strSql.ToString());

            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public static void Edit_term(int TermID, int ID)
        {
            try
            {
                string strsql = "delete from wp_term_relationships where object_id=@object_id";
                MySqlParameter[] para =
                 {
                    new MySqlParameter("@object_id", ID)
                     };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));

            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public static void UpdateMetaData(ProductModel model, long id, string varFieldsName, string varFieldsValue)
        {
            try
            {
                string strsql = "update wp_postmeta set meta_value=@meta_value where post_id=@post_id and meta_key=@meta_key";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@post_id", id),
                    new MySqlParameter("@meta_key", varFieldsName),
                    new MySqlParameter("@meta_value", varFieldsValue),
                };
                SQLHelper.ExecuteNonQuery(strsql, para);
            }
            catch (Exception Ex)
            {
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
                                + " GROUP BY p.ID limit 50;";

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
                MySqlParameter[] parameters =
                {
                    new MySqlParameter("order_id", OrderID)
                };
                if (type.ToUpper() == "ADMINISTRATOR")
                {
                    strSQl = "select wp_c.comment_ID,DATE_FORMAT(wp_c.comment_date, '%M %d, %Y at %H:%i') comment_date,wp_c.comment_content,case when comment_type = 'Private' then 1 else 0 end is_customer_note from wp_Productnotes wp_c"
                            + " where  comment_approved = '1' and comment_post_ID = @order_id order by wp_c.comment_ID desc;";
                }
                else
                {
                    strSQl = "select wp_c.comment_ID,DATE_FORMAT(wp_c.comment_date, '%M %d, %Y at %H:%i') comment_date,wp_c.comment_content,wp_cm.meta_value is_customer_note from wp_Productnotes wp_c"
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


                MySqlParameter[] parameters =
                {
                    new MySqlParameter("@comment_post_ID", obj.post_ID),
                    new MySqlParameter("@comment_date", obj.comment_date),
                    new MySqlParameter("@comment_date_gmt", obj.comment_date_gmt),
                    new MySqlParameter("@comment_content", obj.comment_content),
                    new MySqlParameter("@comment_type", obj.is_customer_note)
                };
                result = SQLHelper.ExecuteNonQuery(strSQL, parameters);
            }
            catch (Exception ex)
            {
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
                MySqlParameter[] parameters =
                {
                    new MySqlParameter("@comment_ID", obj.comment_ID)
                };
                result = SQLHelper.ExecuteNonQuery(strSQL, parameters);
            }
            catch (Exception ex)
            {
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

                string strSQl = "sp_ProductCategory";
                DS = SQLHelper.ExecuteDataTable(strSQl);
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
                MySqlParameter[] para =
                {
                    new MySqlParameter("@name", model.name),
                    new MySqlParameter("@slug",  Regex.Replace(model.slug, @"\s+", "")),
                    new MySqlParameter("@parent", model.parent),
                    new MySqlParameter("@description", model.description == null ? "" : model.description),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
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
                MySqlParameter[] para =
               {
                    new MySqlParameter("@guid", FileName=="" ? "default.png" : FileName)
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
                strSql.Append(string.Format("insert into wp_image (id,thumbnails,image) values ({0},'{1}','{2}'); ", metaid, "default.png",FileName));
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
            { throw ex; }
            return result;
        }

        public static int UpdateBothImage(string thumbFileName,string FileName, long metaid )
        {
            int result = 0;
            try
            {
                //if (FileName == "")
                //    FileName = "default.png";
                StringBuilder strSql = new StringBuilder();
                strSql.Append(string.Format("update wp_image set thumbnails = '{0}', image = '{1}' where id = {2} ", thumbFileName,FileName, metaid));
                result = SQLHelper.ExecuteNonQuery(strSql.ToString());
            }
            catch (Exception ex)
            { throw ex; }
            return result;
        }
        public int AddProductCategory(ProductCategoryModel model, string name, string slug)
        {
            try
            {
                string strsql = "";
                strsql = "insert into wp_terms(name,slug) values(@name,@slug); SELECT LAST_INSERT_ID();";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@name", name),
                    new MySqlParameter("@slug",  Regex.Replace(slug, @"\s+", "-")),
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
                strsql = "Insert into wp_term_taxonomy(term_id,taxonomy,description,parent) values(@term_id,@taxonomy,@description,@parent); INSERT INTO wp_termmeta(term_id,meta_key,meta_value) VALUES(@term_id, 'order', 0),(@term_id, 'display_type', @display_type),(@term_id, 'thumbnail_id', @thumbnail_id),(@term_id,'Is_Active','1'); Update wp_terms set term_order=@term_id where term_id=@term_id;  SELECT LAST_INSERT_ID();";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@term_id", term_id),
                    new MySqlParameter("@taxonomy", "product_cat"),
                    new MySqlParameter("@parent", model.parent),
                    new MySqlParameter("@description", model.description == null ? "" : model.description),
                    new MySqlParameter("@display_type", model.display_type),
                    new MySqlParameter("@thumbnail_id",thumbnail_id),

                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
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
                string strWhr = string.Empty;

                //string strSql = "sp_ProductCategoryByPara;";
                string strSQl = "sp_ProductCategoryByPara";
                dt = SQLHelper.ExecuteDataTable(strSQl);
               // MySqlParameter[] para =
               //{
               //     new MySqlParameter("?pagesize", pagesize.ToString()),
               //     new MySqlParameter("?pageno", pageno),
               //     new MySqlParameter("?searchid", searchid is null ? "" : searchid),
               // };

               // DataSet ds = SQLHelper.ExecuteDataSet(strSql, para);
               // dt = ds.Tables[0];
               // if (ds.Tables[1].Rows.Count > 0)
               //     totalrows = Convert.ToInt32(ds.Tables[1].Rows[0]["TotalRecord"].ToString());
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
                throw Ex;
            }
        }
        public static DataTable GetCategoryByID(long id)
        {
            DataTable dt = new DataTable();
            try
            {
                string strWhr = string.Empty;
                string strSql = "Select tx.term_id ID, t.name,t.slug,tx.taxonomy,tx.description,tx.parent,tx.count," +
                    "max(case when tm.meta_key = 'thumbnail_id' then meta_value end) ThumbnailID, max(case when tm.meta_key = 'display_type' then meta_value end) DisplayType," +
                    "(Select p.post_title from wp_posts p where p.id = max(case when tm.meta_key = 'thumbnail_id' then meta_value end)) ImagePath from wp_terms t " +
                    "left join wp_term_taxonomy tx on tx.term_id = t.term_id left join wp_termmeta tm on t.term_id = tm.term_id  where taxonomy = 'product_cat' and t.term_id = '" + id + "' and 1=1 group by t.name,t.slug,tx.taxonomy,tx.description,tx.parent,tx.count;";
                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
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
                strsql = "Insert into wp_posts(post_author,post_content,post_title,post_excerpt,post_status,comment_status,ping_status,post_name,to_ping,pinged,guid,post_type,post_mime_type,post_date,post_date_gmt,post_content_filtered,post_modified,post_modified_gmt) " +
                    "values(@post_author,@post_content, @post_title,@post_excerpt, @post_status, @comment_status, @ping_status, @post_name,@to_ping,pinged, @guid, @post_type, @post_mime_type,current_timestamp(),current_timestamp(),@post_content_filtered,current_timestamp(),current_timestamp()); SELECT LAST_INSERT_ID();";
                MySqlParameter[] para =
               {
                    new MySqlParameter("@post_author", "8"),
                    new MySqlParameter("@post_content", ""),
                    new MySqlParameter("@post_title", FileName=="" ? "default.png" : FileName),
                    new MySqlParameter("@post_excerpt", ""),
                    new MySqlParameter("@post_status", "inherit"),
                    new MySqlParameter("@comment_status", "closed"),
                    new MySqlParameter("@ping_status", "closed"),
                    new MySqlParameter("@post_name", FileName=="" ? "default.png" : FileName),
                    new MySqlParameter("@to_ping", ""),
                    new MySqlParameter("@pinged", ""),
                    new MySqlParameter("@post_content_filtered", ""),

                    new MySqlParameter("@post_type", "product_cat"),
                    new MySqlParameter("@post_mime_type", FileType),
                    new MySqlParameter("@guid", FileName=="" ? "default.png" : FileName),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public static int EditImage(string FileName, string FilePath, string FileType, long metaid)
        {
            try
            {
                string strsql = "";
                strsql = "update wp_posts set post_author=@post_author,post_title=@post_title,post_status=@post_status,comment_status=@comment_status," +
                    "ping_status = @ping_status,post_name = @post_name,guid = @guid,post_type = @post_type,post_mime_type = @post_mime_type," +
                    "post_modified = current_timestamp(),post_modified_gmt = current_timestamp()  where ID=" + metaid + " ;";
                MySqlParameter[] para =
               {
                    new MySqlParameter("@post_author", "8"),
                    new MySqlParameter("@post_title", FileName=="" ? "default.png" : FileName),
                    new MySqlParameter("@post_status", "inherit"),
                    new MySqlParameter("@comment_status", "closed"),
                    new MySqlParameter("@ping_status", "closed"),
                    new MySqlParameter("@post_name", FileName=="" ? "default.png" : FileName),
                    new MySqlParameter("@post_type", "product_cat"),
                    new MySqlParameter("@post_mime_type", FileType),
                    new MySqlParameter("@guid", FileName=="" ? "default.png" : FileName),
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
                strsql = "Insert into wp_postmeta(post_id, meta_key, meta_value) values(@post_id,'_wp_attached_file', @_wp_attached_file),(@post_id, '_wp_attachment_metadata', @_wp_attachment_metadata); SELECT LAST_INSERT_ID();";
                MySqlParameter[] para =
               {
                    new MySqlParameter("@post_id", post_id),
                    new MySqlParameter("@_wp_attached_file", FilePath),
                    new MySqlParameter("@_wp_attachment_metadata", FilePath),
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
                strsql = "Update wp_posts set guid=@guid,post_title=@post_title,post_name=@post_name where ID=@post_id;" +
                    "Update wp_postmeta set meta_value =@guid where post_id=@post_id and  meta_key='_wp_attached_file'; " +
                    "Update wp_postmeta set meta_value = @guid where post_id = @post_id and meta_key = '_wp_attachment_metadata'; ";
                MySqlParameter[] para =
               {
                    new MySqlParameter("@post_id", post_id),
                    new MySqlParameter("@guid", FilePath),
                    new MySqlParameter("@post_title", FileName=="" ? "default.png" : FileName),
                    new MySqlParameter("@post_name", FileName=="" ? "default.png" : FileName),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;


            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public string GetFileName(long PostID)
        {
            string result = "";
            DataTable dt = new DataTable();
            try
            {
                string strSQl = "Select post_title from wp_posts WHERE ID =" + PostID + "; ";
                result = SQLHelper.ExecuteScalar(strSQl).ToString();
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
                string strSQl = "select group_concat(tm. term_taxonomy_id) ID from wp_term_relationships tr inner join wp_term_taxonomy tm on tm. term_taxonomy_id = tr.term_taxonomy_id  and taxonomy = 'product_cat'  WHERE object_id =" + PostID + "; ";
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
                    string parent = GetParent(termID).ToString();
                    string strSQl = "";
                    if (parent == "0")
                    {
                        //strSQl = "sp_getTermID";
                        strSQl = string.Format("SELECT group_concat(c.term_id) as term_id FROM " +
                            "(" +
                            "SELECT term_taxonomy_id,t.term_id, name,slug, name as path, 0 as level FROM wp_term_taxonomy tx inner join wp_terms t on t.term_id = tx.term_id " +
                            "WHERE parent=0 and taxonomy='product_cat' and tx.term_taxonomy_id in ({0}) " +
                            "union all " +
                            "SELECT c.term_taxonomy_id, t.term_id, t.name ,t.slug, CONCAT(cp.path, ' > ', t.name), " +
                            "CONCAT(level + 1, t.name) as level " +
                            "FROM (SELECT term_taxonomy_id,t.term_id, name,slug, name as path, 0 as level FROM wp_term_taxonomy tx left join wp_terms t on t.term_id = tx.term_id " +
                            "WHERE parent=0 and taxonomy='product_cat' and tx.term_taxonomy_id in ({0})) AS cp " +
                            "JOIN wp_term_taxonomy AS c ON cp.term_taxonomy_id = c.parent left join wp_terms t on t.term_id = c.term_taxonomy_id) as  c " +
                            "left join wp_termmeta tm_a on tm_a.term_id = c.term_id and tm_a.meta_key = 'Is_Active' " +
                            "left join wp_termmeta tm on c.term_id = tm.term_id and tm.meta_key = 'thumbnail_id' " +
                            "left join wp_posts p on tm.meta_value = p.ID where  coalesce(tm_a.meta_value,'1') = '1' ORDER BY path; ", termID);
                    }
                    else
                    {
                        strSQl = "SELECT group_concat(c.term_id) as term_id FROM wp_terms t " +
                    "inner join wp_term_taxonomy c on t.term_id = c.term_id " +
                    "left join wp_termmeta tm_a on tm_a.term_id = t.term_id and tm_a.meta_key = 'Is_Active' " +
                    "where coalesce(tm_a.meta_value,'1') = '1' and t.term_id in (" + termID + ")";
                    }
                   // MySqlParameter[] para =
                   // {
                   // new MySqlParameter("@Userterm_ID", termID)
                   //};
                    ds = SQLHelper.ExecuteDataSet(strSQl);

                    if (ds.Tables[0].Rows.Count > 0)
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
        public string GetParent(string ID)
        {
            string result = "";
            DataSet ds = new DataSet();
            try
            {
                string strSQl = "Select parent from wp_term_taxonomy where term_id=" + ID + "";
                ds = SQLHelper.ExecuteDataSet(strSQl);
                result = ds.Tables[0].Rows[0]["parent"].ToString();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }

        //public string GetProductID(string ID)
        //{
        //    string result = "";
        //    DataSet dt = new DataSet();
        //    try
        //    {
        //        string strSQl = "sp_getProductID";
        //        MySqlParameter[] para =
        //             {
        //                   new MySqlParameter("@Userterm_ID", ID)
        //             };
        //        DataSet ds = SQLHelper.ExecuteDataSet(strSQl,para);
        //        if (ds.Tables[0].Rows.Count > 0)
        //            result = ds.Tables[0].Rows[0]["object_id"].ToString();
        //        else
        //            result = "0";
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex;
        //    }
        //    return result;
        //}
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
                    string parent = GetParent(termID).ToString();
                    string strSQl = "";
                    if (parent == "0")
                    {
                        //strSQl = "sp_getProductID";
                        strSQl = string.Format("SELECT GROUP_CONCAT(tr.object_id) object_id FROM " +
                            "(" +
                            "SELECT tx.term_taxonomy_id, t.term_id, name, slug, name as path, 0 as level FROM " +
                            "wp_term_taxonomy tx inner join wp_terms t on t.term_id = tx.term_id WHERE parent = 0 and tx.taxonomy = 'product_cat' and tx.term_taxonomy_id in ({0}) " +
                            "union all " +
                            "SELECT c.term_taxonomy_id, t.term_id, t.name, t.slug, CONCAT(cp.path, ' > ', t.name), " +
                            "CONCAT(level + 1, t.name) as level FROM(SELECT tx.term_taxonomy_id, t.term_id, name, slug, name as path, 0 as level FROM " +
                            "wp_term_taxonomy tx inner join wp_terms t on t.term_id = tx.term_id WHERE parent = 0 and tx.taxonomy = 'product_cat' and tx.term_taxonomy_id in ({0})) AS cp " +
                            "JOIN wp_term_taxonomy AS c ON cp.term_taxonomy_id = c.parent left join wp_terms t on t.term_id = c.term_taxonomy_id) as c " +
                            "left join wp_term_relationships tr on tr.term_taxonomy_id = c.term_id " +
                            "left join wp_termmeta tm_a on tm_a.term_id = c.term_id and tm_a.meta_key = 'Is_Active' " +
                            "left join wp_termmeta tm on c.term_id = tm.term_id and tm.meta_key = 'thumbnail_id' left join wp_posts p on tm.meta_value = p.ID " +
                            "where  coalesce(tm_a.meta_value, '1') = '1' ORDER BY path; ", termID);
                    }
                    else
                    {
                        strSQl = "SELECT GROUP_CONCAT(tr.object_id) object_id FROM wp_terms t " +
                    "inner join wp_term_taxonomy c on t.term_id = c.term_id " +
                    "inner join wp_term_relationships tr on tr.term_taxonomy_id = t.term_id " +
                    "left join wp_termmeta tm_a on tm_a.term_id = t.term_id and tm_a.meta_key = 'Is_Active' " +
                    "where coalesce(tm_a.meta_value,'1') = '1' and t.term_id in (" + ID + ")";
                    }
                   // MySqlParameter[] para =
                   //{
                   // new MySqlParameter("@Userterm_ID", termID)
                   //};
                    DataSet ds = SQLHelper.ExecuteDataSet(strSQl);
                    if (ds.Tables[0].Rows.Count > 0)
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
    }
}