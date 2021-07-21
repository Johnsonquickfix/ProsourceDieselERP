using LaylaERP.DAL;
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
                string strSql = "SELECT  p.ID,t.term_id, p.post_title, `post_excerpt`, t.name AS product_category, t.term_id AS product_id,t.slug AS product_slug,tt.term_taxonomy_id AS tt_term_taxonomia, "
                                + " tr.term_taxonomy_id AS tr_term_taxonomia, p.post_status,post_modified_gmt,CONCAT(p.post_status, ' ', post_modified_gmt) Date,'*' Star, IFNULL(CONCAT(Min(CASE WHEN pm1.meta_key = '_price' then CONCAT('$', pm1.meta_value) ELSE NULL END), '-', MAX(CASE WHEN pm1.meta_key = '_price' then CONCAT('$', pm1.meta_value) ELSE NULL END)), '$0.00') price,"
                                + " MAX(CASE WHEN pm1.meta_key = '_sku' then pm1.meta_value ELSE NULL END) as sku , pmstc.meta_value stockstatus"
                                  + " FROM wp_posts p"
                                  + " LEFT JOIN wp_postmeta pm1 ON pm1.post_id = p.ID"
                                  + " LEFT JOIN wp_postmeta pmstc ON pmstc.post_id = p.ID and pmstc.meta_key = '_stock_status'"
                                  + " LEFT JOIN wp_term_relationships AS tr ON tr.object_id = p.ID"
                                  + " JOIN wp_term_taxonomy AS tt ON tt.term_taxonomy_id = tr.term_taxonomy_id and tt.taxonomy IN('product_cat','product_type')"
                                  + " JOIN wp_terms AS t ON t.term_id = tt.term_id"
                                  + " WHERE p.post_type in('product') " + strWhr 
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


    }
}