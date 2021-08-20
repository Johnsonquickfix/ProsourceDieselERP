using LaylaERP.DAL;
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

                string strSql = "select sum(case when post_status not in('auto-draft','trash') then 1 else 0 end) AllOrder,"
                            + " sum(case when post_status = 'publish' then 1 else 0 end) Publish,"
                            + " sum(case post_status when 'private' then 1 else 0 end) Private,"
                            + " sum(case when post_status = 'trash' then 1 else 0 end) Trash"
                            + " from wp_posts p where p.post_type = 'product' and post_status != 'draft'";

                dt = SQLHelper.ExecuteDataTable(strSql);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static DataTable GetCategoryType()
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
        public static DataTable GetDataByID(OrderPostStatusModel model)
        {
            DataTable dt = new DataTable();

            try
            {
                string strWhr = string.Empty;

                string strSql = "SELECT P.ID ID,post_title,post_content,post_name,"
                             + "  pmregularamount.meta_value regularamount,pmsaleprice.meta_value saleprice,pmtotalsales.meta_value totalsales,pmtaxstatus.meta_value axstatus,pmtaxclass.meta_value taxclass,pmmanagestock.meta_value managestock,pmsoldindividually.meta_value soldindividually,"
                             + "  pmbackorders.meta_value backorders,pmweight.meta_value weight,pmlength.meta_value length,pmeheight.meta_value height,pmwidth.meta_value width,pmupsellids.meta_value upsellids,pmcrosssellids.meta_value crosssellids,"
                             + "  pmstock.meta_value stock,pmstockstatus.meta_value stockstatus,pmlowstockamount.meta_value lowstockamount, pmsku.meta_value sku,pmsatt.meta_value productattributes,(SELECT group_concat(ID) FROM `wp_posts` where post_parent = P.ID) VariantID,"
                             + " (select term_id  from wp_terms where term_id in ( select term_id from wp_term_taxonomy where taxonomy = 'product_type' and term_taxonomy_id in (SELECT term_taxonomy_id FROM `wp_term_relationships` where object_id = P.ID))) ProductsID,"
                             + " (select term_id from wp_terms where term_id in ( select term_id from wp_term_taxonomy where taxonomy = 'product_shipping_class' and term_taxonomy_id in (SELECT term_taxonomy_id FROM `wp_term_relationships` where object_id = P.ID))) shippingclass,"
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
                             + " WHERE P.post_type = 'product' and P.ID = " + model.strVal + " ";


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

                string strSql = "SELECT rowid ID,fk_vendor,purchase_price,cost_price,minpurchasequantity,salestax,taxrate,discount,remark,taglotserialno,shipping_price from Product_Purchase_Items"
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

                        strWhr += " and p.fk_product = " + strValue1;
                    string strSQl = "SELECT distinct fk_product_fils ID,wp.post_title,post_title title,ifnull((SELECT min(FORMAT(purchase_price,2)) purchase_price from Product_Purchase_Items where fk_product = p.fk_product_fils),'0.00') buyingprice,ifnull(FORMAT(pmsaleprice.meta_value,2),'0.00') sellingpric,0 Stock ,qty"
                                + " FROM product_association p"
                                + "  left outer join wp_posts wp on wp.ID = p.fk_product_fils"
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
                        strWhr += " fk_product_fils = " + strValue1;
                    string strSQl = "SELECT distinct fk_product_fils ID,wp.post_title,post_title title,qty"
                                + " FROM product_association p"
                                + "  left outer join wp_posts wp on wp.ID = p.fk_product"
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
                    string strSQl = "SELECT ppi.rowid,name,minpurchasequantity,FORMAT(salestax,2) salestax,FORMAT(purchase_price, 2) purchase_price,FORMAT(cost_price, 2) cost_price,FORMAT(shipping_price, 2) shipping_price,DATE_FORMAT(date_inc, '%m-%d-%Y') date_inc,ppi.discount,taglotserialno"
                                + " FROM Product_Purchase_Items ppi"
                                + " left outer JOIN wp_vendor wpv on wpv.rowid = ppi.fk_vendor"
                                + " WHERE " + strWhr;

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
                        productsModel.date_inc = sdr["date_inc"].ToString();
                        productsModel.discount = sdr["discount"].ToString();
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

                string strSql = "SELECT count(distinct Filename) filecount, P.ID ID,post_title,FORMAT(pmregularamount.meta_value,2) regularamount,FORMAT(pmsaleprice.meta_value,2) saleprice,min( FORMAT(purchase_price,2)) purchase_price,min(FORMAT(cost_price,2)) cost_price,(select name from wp_vendor where rowid = Product_Purchase_Items.fk_vendor and cost_price = min(cost_price) )vname,pmsku.meta_value sku,pmpublic.meta_value Public_Notes,pmprivate.meta_value Private_Notes"
                             + " FROM wp_posts P"
                             + " left join wp_postmeta pmregularamount on P.ID = pmregularamount.post_id and pmregularamount.meta_key = '_regular_price'"
                             + " left join wp_postmeta pmsaleprice on P.ID = pmsaleprice.post_id and pmsaleprice.meta_key = '_sale_price'"
                             + " left join wp_postmeta pmprivate on P.ID = pmprivate.post_id and pmprivate.meta_key = 'Private_Notes'"
                             + " left join wp_postmeta pmpublic on P.ID = pmpublic.post_id and pmpublic.meta_key = 'Public_Notes'"
                             + " left join Product_Purchase_Items on Product_Purchase_Items.fk_product = P.ID"
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
                string strSql = "SELECT p.id,p.post_title,p.post_content,p.post_name,concat('{', group_concat(concat('\"',LOWER(pm.meta_key), '\": \"', pm.meta_value,'\"')), '}') meta_data,"
                        + " (SELECT term_taxonomy_id FROM wp_term_relationships where object_id = p.ID) shippingclass"
                        + " FROM wp_posts p left outer join wp_postmeta pm on pm.post_id = p.id"
                        + " and(pm.meta_key in ('_regular_price', '_sale_price', 'total_sales', '_tax_status', '_tax_class', '_manage_stock', '_backorders', '_sold_individually',"
                        + " '_weight', '_length', '_width', '_height', '_upsell_ids', '_crosssell_ids', '_stock', '_low_stock_amount', '_sku', '_product_attributes','_variation_description')"
                        + " or meta_key like 'Attribute_%')"
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
        public static DataTable GetProductcategoriesList()
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
                    string strSQl = "SELECT pw.rowid as ID,fk_product,fk_warehouse ,ref warehouse"
                                + " from product_warehouse pw"
                                + " Left outer join wp_warehouse on wp_warehouse.rowid = pw.fk_warehouse"
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
                        if (sdr["warehouse"] != DBNull.Value)
                            productsModel.product_name = sdr["warehouse"].ToString();
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
                            + " OR t.name like '%" + searchid + "%' "
                            + " OR t.slug like '%" + searchid + "%' "
                            + " OR p.post_status like '%" + searchid + "%' "
                            + " OR pm1.meta_value like '%" + searchid + "%' "
                            + " OR pmstc.meta_value like '%" + searchid + "%' "


                            + " )";
                }
                if (!string.IsNullOrEmpty(strValue1))
                {

                    strWhr += " and t.term_id =" + strValue1 + " ";
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

                string strSql = "SELECT  p.ID,t.term_id, p.post_title, t.name AS product_category,p.post_status,post_date_gmt,CONCAT(p.post_status, ' ', post_date_gmt) "
                + " Date,'*' Star, group_concat(distinct t.term_id) namecategoty,case when LOCATE(4, (group_concat(distinct t.term_id))) > 0  then 'yes' else 'no' end pricecodition,"
                + " case when LOCATE(4, (group_concat(distinct t.term_id))) > 0  then (IFNULL(CONCAT(Min(CASE WHEN pm1.meta_key = '_price' then CONCAT('$', pm1.meta_value) ELSE NULL END), '-', MAX(CASE WHEN pm1.meta_key = '_price' then CONCAT('$', pm1.meta_value) ELSE NULL END)), '$0.00')) else CONCAT('$', pmreg.meta_value, '-', '$', pmsalpr.meta_value) end price,"
                + " MAX(CASE WHEN pm1.meta_key = '_sku' then pm1.meta_value ELSE NULL END) as sku , pmstc.meta_value stockstatus,"
                + " (select group_concat(ui.name) from wp_terms ui join wp_term_taxonomy uim on uim.term_id = ui.term_id and uim.taxonomy IN('product_cat') JOIN wp_term_relationships AS trp ON trp.object_id = p.ID and trp.term_taxonomy_id = uim.term_taxonomy_id) itemname"
                + " ,pmreg.meta_value Regprice,pmsalpr.meta_value SalPrice"
                + " FROM wp_posts p"
                + " LEFT JOIN wp_postmeta pm1 ON pm1.post_id = p.ID"
                + " LEFT JOIN wp_postmeta pmreg ON pmreg.post_id = p.ID  and pmreg.meta_key = '_regular_price'"
                + " LEFT JOIN wp_postmeta pmsalpr ON pmsalpr.post_id = p.ID  and pmsalpr.meta_key= '_sale_price'"
                + " LEFT JOIN wp_postmeta pmstc ON pmstc.post_id = p.ID and pmstc.meta_key = '_stock_status'"
                + " LEFT JOIN wp_term_relationships AS tr ON tr.object_id = p.ID"
                + " LEFT JOIN wp_term_taxonomy AS tt ON tt.term_taxonomy_id = tr.term_taxonomy_id"
                + " JOIN wp_terms AS t ON t.term_id = tt.term_id"
                + " WHERE p.post_type in('product') and p.post_status != 'draft' and tt.taxonomy IN('product_cat','product_type') " + strWhr
                + " GROUP BY p.ID"
                + " order by " + SortCol + " " + SortDir + " limit " + (pageno).ToString() + ", " + pagesize + "";

                strSql += "; SELECT count(distinct p.ID) TotalRecord FROM wp_posts p"
                            + " LEFT JOIN wp_postmeta pm1 ON pm1.post_id = p.ID"
                            + " LEFT JOIN wp_postmeta pmstc ON pmstc.post_id = p.ID and pmstc.meta_key = '_stock_status'"
                            + " LEFT JOIN wp_term_relationships AS tr ON tr.object_id = p.ID"
                            + " JOIN wp_term_taxonomy AS tt ON tt.term_taxonomy_id = tr.term_taxonomy_id and tt.taxonomy IN('product_cat','product_type')"
                            + " JOIN wp_terms AS t ON t.term_id = tt.term_id"
                            + " WHERE p.post_type in('product') and p.post_status != 'draft' " + strWhr.ToString();
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
                string strsql = "update wp_posts set post_title=@post_title,post_name=@post_name, post_content=@post_content,post_type='product',post_status='publish'  where ID =" + ID + "";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@post_content", model.post_content),
                    new MySqlParameter("@post_title", model.post_title),
                    new MySqlParameter("@post_name", model.post_name),
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
                strSql.Append(string.Format("insert into Product_Purchase_Items ( fk_product,fk_vendor,purchase_price,cost_price,minpurchasequantity,salestax,taxrate,discount,remark,taglotserialno,shipping_price) values ({0},{1},{2},{3},{4},{5},{6},{7},'{8}','{9}',{10}) ", model.fk_product, model.fk_vendor, model.purchase_price, model.cost_price, model.minpurchasequantity, model.salestax, model.taxrate, model.discount, model.remark, model.taglotserialno, model.shipping_price));

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
                strSql.Append(string.Format("update Product_Purchase_Items set fk_vendor = {0} ,purchase_price = {1},cost_price = {2},minpurchasequantity = {3},salestax = {4},taxrate = {5},discount = {6},remark = '{7}',taglotserialno = '{8}',shipping_price = {9} where rowid = {10} ", model.fk_vendor, model.purchase_price, model.cost_price, model.minpurchasequantity, model.salestax, model.taxrate, model.discount, model.remark, model.taglotserialno, model.shipping_price, model.ID));

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
                StringBuilder strSql = new StringBuilder(string.Format("delete from Product_Purchase_Items where rowid = {0}; ", model.ID));

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
                StringBuilder strSql = new StringBuilder(string.Format("delete from product_warehouse where rowid = {0}; ", model.ID));

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

                    strSql.Append("Insert into product_association(fk_product,fk_product_fils,qty) values(" + obj.fk_product + ",'" + obj.fk_product_fils + "','" + obj.qty + "');SELECT LAST_INSERT_ID();");
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
                        strSql.Append("delete from product_association where fk_product =" + obj.fk_product + " and fk_product_fils =" + obj.fk_product_fils + ";");
                    else
                        strSql.Append(string.Format("update product_association set qty = '{0}' where fk_product_fils = '{1}' and fk_product = '{2}' ; ", obj.qty, obj.fk_product_fils, obj.fk_product));
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

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Product Categories~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        public static DataSet GetParentCategory()
        {
            DataSet DS = new DataSet();
            try
            {
                string strSQl = "Select tx.term_taxonomy_id ID,t.name from wp_term_taxonomy tx left join wp_terms t on tx.term_id=t.term_id where tx.taxonomy='product_cat' order by tx.term_taxonomy_id desc;";
                DS = SQLHelper.ExecuteDataSet(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }
        public int EditProductCategory(ProductCategoryModel model, string name, string slug, string parent, string description)
        {
            try
            {
                string strsql = "";
                strsql = "update wp_terms set name=@name,slug=@slug where term_id=" + model.term_id + "; update wp_term_taxonomy set description=@description,parent=@parent where term_id=" + model.term_id + ";";
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

        public int AddProductCategoryDesc(ProductCategoryModel model, long term_id, int thumbnail_id)
        {
            try
            {
                string strsql = "";
                strsql = "Insert into wp_term_taxonomy(term_id,taxonomy,description,parent) values(@term_id,@taxonomy,@description,@parent);INSERT INTO wp_termmeta(term_id,meta_key,meta_value) VALUES(@term_id, 'order', 0),(@term_id, 'display_type', @display_type),(@term_id, 'thumbnail_id', @thumbnail_id); SELECT LAST_INSERT_ID();";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@term_id", term_id),
                    new MySqlParameter("@taxonomy", "product_cat"),
                    new MySqlParameter("@parent", model.parent),
                    new MySqlParameter("@description", model.description == null ? "" : model.description),
                    new MySqlParameter("@display_type", model.display_type),
                    new MySqlParameter("@thumbnail_id",thumbnail_id == null ? 0 : thumbnail_id),

                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public static DataTable ProductCategoryList(long id, string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;

                string strSql = "Select p.post_title ImagePath, tm.meta_value, tm.meta_key, tx.term_id ID, t.name,t.slug,tx.taxonomy,tx.description,tx.parent,tx.count from wp_terms t " +
                    "left join wp_term_taxonomy tx on tx.term_id = t.term_id left join wp_termmeta tm on t.term_id = tm.term_id " +
                    "left join wp_posts p on tm.meta_value = p.ID where taxonomy = 'product_cat' and tm.meta_key = 'thumbnail_id' and 1 = 1 ";
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (t.name like '%" + searchid + "%')";
                }
                if (userstatus != null)
                {
                    strWhr += " and (v.VendorStatus='" + userstatus + "') ";
                }
                strSql += strWhr + string.Format(" order by {0} {1} LIMIT {2}, {3}", SortCol, SortDir, pageno.ToString(), pagesize.ToString());

                strSql += "; SELECT ceil(Count(tx.term_id)/" + pagesize.ToString() + ") TotalPage,Count(tx.term_id) TotalRecord  from wp_terms t " +
                    "left join wp_term_taxonomy tx on tx.term_id = t.term_id left join wp_termmeta tm on t.term_id = tm.term_id " +
                    "left join wp_posts p on tm.meta_value = p.ID where taxonomy = 'product_cat' and tm.meta_key = 'thumbnail_id' and 1 = 1  " + strWhr.ToString();

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
        public int DeleteProductCategory(ProductCategoryModel model)
        {
            try
            {
                string strsql = "";
                strsql = "delete from wp_terms where term_id in (" + model.strVal + "); delete from wp_term_taxonomy where term_id in (" + model.strVal + ")";
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql));
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
                string strSql = "Select p.post_title ImagePath,tm.meta_value MetaID, tx.term_id ID, t.name,t.slug,tx.taxonomy,tx.description,tx.parent,tx.count from wp_terms t left join wp_term_taxonomy tx on tx.term_id = t.term_id left join wp_termmeta tm on t.term_id = tm.term_id left join wp_posts p on tm.meta_value = p.ID where taxonomy = 'product_cat' and tm.meta_key = 'thumbnail_id' and t.term_id = '" + id + "'";
                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dt = ds.Tables[0];

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static int FileUpload(string FileName, string FilePath, string FileType)
        {
            try
            {
                string strsql = "";
                strsql = "Insert into wp_posts(post_author,post_title,post_status,comment_status,ping_status,post_name,guid,post_type,post_mime_type) values(@post_author, @post_title, @post_status, @comment_status, @ping_status, @post_name, @guid, @post_type, @post_mime_type); SELECT LAST_INSERT_ID();";
                //strSql.Append(string.Format("insert into erp_VendorLinkedFiles(VendorID,FileName,FileSize,FileType,FilePath) values(@VendorID,@FileName,@FileSize,@FileType,@FilePath);SELECT LAST_INSERT_ID();"));
                MySqlParameter[] para =
               {
                    new MySqlParameter("@post_author", "8"),
                    new MySqlParameter("@post_title", FileName),
                    new MySqlParameter("@post_status", "inherit"),
                    new MySqlParameter("@comment_status", "closed"),
                    new MySqlParameter("@ping_status", "closed"),
                    new MySqlParameter("@post_name", FileName),
                    new MySqlParameter("@post_type", "shop_order"),
                    new MySqlParameter("@post_mime_type", FileType),
                    new MySqlParameter("@guid", FilePath),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
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
                strsql = "Update wp_posts set guid=@guid,post_title=@post_title,post_name=@post_name where ID=@post_id;";
                MySqlParameter[] para =
               {
                    new MySqlParameter("@post_id", post_id),
                    new MySqlParameter("@guid", FilePath),
                    new MySqlParameter("@post_title", FileName),
                    new MySqlParameter("@post_name", FileName),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;


            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }


    }
}