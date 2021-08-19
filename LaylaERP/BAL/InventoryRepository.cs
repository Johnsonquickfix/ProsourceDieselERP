using LaylaERP.DAL;
using LaylaERP.Models;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace LaylaERP.BAL
{
	public class InventoryRepository
	{
        public static DataSet GetProducts()
        {
            DataSet DS = new DataSet();
            try
            {
                string strSQl = "SELECT p.id,CONCAT(p.post_title, COALESCE(CONCAT(' (',s.meta_value,')'),'')) text FROM wp_posts AS p left join wp_postmeta as s on p.id = s.post_id and s.meta_key = '_sku' WHERE p.post_parent = 0 AND p.post_type = 'product' AND p.post_status != 'draft' group by p.post_title;"
                            + " Select t.term_id id,name text From wp_terms t Left Join wp_term_taxonomy tt On t.term_id = tt.term_id WHERE tt.taxonomy = 'product_cat'";

                DS = SQLHelper.ExecuteDataSet(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }
        public static DataTable GetVarients(string parent, string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;

                string strSql = "SELECT p.ID, SUBSTRING_INDEX(p.post_title, '-', -1) as post, p.post_title,if(sum(meta_value) is null,0,sum(meta_value)) as Count,s.meta_id FROM wp_posts AS p, wp_postmeta AS s WHERE p.post_parent ='" + parent + "' AND p.post_type = 'product_variation' AND (p.post_status = 'publish' or p.post_status = 'private') AND p.id = s.post_id AND s.meta_key = '_stock' group by p.post_title";
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (User_Email like '%" + searchid + "%' OR User_Login='%" + searchid + "%' OR user_nicename='%" + searchid + "%' OR ID='%" + searchid + "%' OR um.meta_value like '%" + searchid + "%')";
                }
                if (userstatus != null)
                {
                    strWhr += " and (ur.user_status='" + userstatus + "') ";
                }
                //strSql += strWhr + string.Format(" order by {0} {1} LIMIT {2}, {3}", SortCol, SortDir, (pageno * pagesize).ToString(), pagesize.ToString());

                strSql += "; SELECT ceil(Count(ur.id)/" + pagesize.ToString() + ") TotalPage,Count(ur.id) TotalRecord from wp_users ur INNER JOIN wp_usermeta um on um.meta_key='wp_capabilities' And um.user_id = ur.ID And um.meta_value LIKE '%customer%' WHERE 1 = 1 " + strWhr.ToString();

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

        public static DataTable GetConsignmentInventory(string parent, string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;

                string strSql = "SELECT p.ID, SUBSTRING_INDEX(p.post_title, '-', -1) as post, p.post_title,if(sum(meta_value) is null,0,sum(meta_value)) as Count,s.meta_id FROM wp_posts AS p, wp_postmeta AS s WHERE p.post_parent ='" + parent + "' AND p.post_type = 'product_variation' AND (p.post_status = 'publish' or p.post_status = 'private') AND p.id = s.post_id AND s.meta_key = '_stock' group by p.post_title";
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (User_Email like '%" + searchid + "%' OR User_Login='%" + searchid + "%' OR user_nicename='%" + searchid + "%' OR ID='%" + searchid + "%' OR um.meta_value like '%" + searchid + "%')";
                }
                if (userstatus != null)
                {
                    strWhr += " and (ur.user_status='" + userstatus + "') ";
                }
                //strSql += strWhr + string.Format(" order by {0} {1} LIMIT {2}, {3}", SortCol, SortDir, (pageno * pagesize).ToString(), pagesize.ToString());

                strSql += "; SELECT ceil(Count(ur.id)/" + pagesize.ToString() + ") TotalPage,Count(ur.id) TotalRecord from wp_users ur INNER JOIN wp_usermeta um on um.meta_key='wp_capabilities' And um.user_id = ur.ID And um.meta_value LIKE '%customer%' WHERE 1 = 1 " + strWhr.ToString();

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
        public static DataTable GetProductStock(string strSKU, string categoryid, string productid)
        {
            DataTable dt = new DataTable();
            try
            {
                string strWhr = string.Empty, strHav = string.Empty;
                if (!string.IsNullOrEmpty(strSKU))
                {
                    strHav += " having max(case when p.id = s.post_id and s.meta_key = '_sku' then s.meta_value else '' end) = '" + strSKU + "'";
                }
                if (!string.IsNullOrEmpty(categoryid))
                {
                    strWhr += " and (case when p.post_parent = 0 then p.id else p.post_parent end) in (select object_id from wp_term_relationships ttr where ttr.term_taxonomy_id='" + categoryid + "')";
                }
                if (!string.IsNullOrEmpty(productid))
                {
                    strWhr += " and (case when p.post_parent = 0 then p.id else p.post_parent end) = '" + productid + "'";
                }

                string strSql = "select p.id,p.post_type,p.post_title,max(case when p.id = s.post_id and s.meta_key = '_sku' then s.meta_value else '' end) sku,"
                            + " max(case when p.id = s.post_id and s.meta_key = '_regular_price' then s.meta_value else '' end) regular_price,"
                            + " max(case when p.id = s.post_id and s.meta_key = '_price' then s.meta_value else '' end) sale_price,"
                            + " coalesce(sum(openning_stock),0) stock,(case when p.post_parent = 0 then p.id else p.post_parent end) p_id,p.post_parent,p.post_status"
                            + " FROM wp_posts as p left join wp_postmeta as s on p.id = s.post_id left outer join product_warehouse pwr on pwr.fk_product=p.id"
                            + " where p.post_type in ('product', 'product_variation') and p.post_status != 'draft' " + strWhr
                            + " group by p.id " + strHav + " order by p_id";
                //string strSql = "select json_object('id',p.id,'post_title',p.post_title,'children',concat('[',group_concat(json_object('id', sp.id, 'post_title', sp.post_title)),']')) as json"
                //            + " from wp_posts p"
                //            + " left outer join wp_posts sp on sp.post_parent = p.id and sp.post_type = 'product_variation' and sp.post_status != 'draft'"
                //            + " where p.post_type = 'product' and p.post_status != 'draft'"
                //            + " group by p.id";
                dt = SQLHelper.ExecuteDataTable(strSql);
                //strSql += strWhr + string.Format(" order by {0} {1} LIMIT {2}, {3}", SortCol, SortDir, (pageno * pagesize).ToString(), pagesize.ToString());

                //DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                //dt = ds.Tables[0];
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static DataTable GetWarehouseStock(string product_id)
        {
            DataTable dt = new DataTable();
            try
            {
                MySqlParameter[] parameters =
                {
                    new MySqlParameter("@product_id", product_id)
                };
                string strSql = "select ref,openning_stock stock from product_warehouse pwr left outer join wp_warehouse wr on wr.rowid = pwr.fk_warehouse where fk_product = @product_id";
                
                dt = SQLHelper.ExecuteDataTable(strSql, parameters);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public int EditInventoryStock(string meta_id, string meta_value)
        {
            try
            {
                int result = 0;
                string[] ID = meta_id.Split(',');
                string[] value = meta_value.Split(',');

                for (int i = 0; i <= value.Length - 1; i++)
                {
                    meta_id = ID[i].ToString();
                    meta_value = value[i].ToString();

                    string strsql = "Update wp_postmeta set meta_value=@meta_value where meta_id=@meta_id AND meta_key = '_stock';";
                    MySqlParameter[] para =
                    {
                    new MySqlParameter("@meta_id", meta_id),
                    new MySqlParameter("@meta_value", meta_value)
                    };
                    result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                }
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
    }
}