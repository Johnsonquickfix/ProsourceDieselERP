using LaylaERP.DAL;
using LaylaERP.Models;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
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
                            + " from wp_posts p where p.post_type = 'product'";

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
                string strquery = "SELECT t.term_id,CONCAT(name,' ','(', count,')') NameCount FROM wp_terms AS t INNER JOIN wp_term_taxonomy AS tt ON tt.term_id = t.term_id INNER JOIN wp_term_relationships AS tr ON tr.term_taxonomy_id = tt.term_taxonomy_id WHERE tt.taxonomy IN('product_cat') GROUP by t.term_id";
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
                             + "  pmstock.meta_value stock,pmstockstatus.meta_value stockstatus,pmlowstockamount.meta_value lowstockamount, pmsku.meta_value sku,"
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
        public static DataTable GetList(string strValue1, string userstatus, string strValue3,string strValue4, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "order_id", string SortDir = "DESC")
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
                //    strWhr += " and p.post_status != 'trash' ";
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
                + " WHERE p.post_type in('product') and tt.taxonomy IN('product_cat','product_type') " + strWhr
                + " GROUP BY p.ID"
                + " order by " + SortCol + " " + SortDir + " limit " + (pageno).ToString() + ", " + pagesize + "";

                strSql += "; SELECT count(distinct p.ID) TotalRecord FROM wp_posts p"
                            + " LEFT JOIN wp_postmeta pm1 ON pm1.post_id = p.ID"
                            + " LEFT JOIN wp_postmeta pmstc ON pmstc.post_id = p.ID and pmstc.meta_key = '_stock_status'"
                            + " LEFT JOIN wp_term_relationships AS tr ON tr.object_id = p.ID"
                            + " JOIN wp_term_taxonomy AS tt ON tt.term_taxonomy_id = tr.term_taxonomy_id and tt.taxonomy IN('product_cat','product_type')"
                            + " JOIN wp_terms AS t ON t.term_id = tt.term_id"                         
                            + " WHERE p.post_type in('product') " + strWhr.ToString();
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
                string strsql = "Insert into wp_posts(post_date,post_date_gmt,post_content,post_excerpt,post_title,post_name,post_status,post_type,to_ping, pinged,post_content_filtered,post_mime_type,post_parent) values(@post_date,@post_date_gmt,@post_content,@post_excerpt,@post_title,@post_name,@post_status,@post_status,@to_ping, @pinged,@post_content_filtered,@post_mime_type,@post_parent);SELECT LAST_INSERT_ID();";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@post_date", DateTime.Now),
                    new MySqlParameter("@post_date_gmt", DateTime.UtcNow),
                    new MySqlParameter("@post_content", model.post_content),
                    new MySqlParameter("@post_excerpt", string.Empty),
                    new MySqlParameter("@post_title", model.post_title),
                    new MySqlParameter("@post_status", model.post_status),
                    new MySqlParameter("@post_name", model.post_name),
                    new MySqlParameter("@to_ping", string.Empty),
                    new MySqlParameter("@pinged", string.Empty),
                    new MySqlParameter("@post_content_filtered", string.Empty),
                    new MySqlParameter("@post_mime_type", string.Empty),
                    new MySqlParameter("@post_parent", model.post_parent),
                };
              int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
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
                string strsql = "update wp_posts set post_title=@post_title,post_name=@post_name, post_content=@post_content  where ID =" + ID + "";
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

                string strSQl = "select p.id, CONCAT(p.post_title,'(',MAX(CASE WHEN pm1.meta_key = '_sku' then pm1.meta_value else null end) , ')') as Name"
                            + " FROM wp_posts p LEFT JOIN wp_postmeta pm1 ON pm1.post_id = p.ID and pm1.meta_key = '_sku'"
                            + " WHERE p.post_type in('product') and pm1.meta_value is not NULL and p.id in (" + model.strVal + ") "
                            + " GROUP BY p.ID limit 50;";
         
                dt = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

    }
}