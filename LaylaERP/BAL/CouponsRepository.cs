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
    public class CouponsRepository
    {
       
        public static int AddCoupons(CouponsModel model)
        {
            try
            {
                string strsql = "Insert into wp_posts(post_date,post_date_gmt,post_content,post_excerpt,post_title,post_name,post_status,post_type,to_ping, pinged,post_content_filtered,post_mime_type) values(@post_date,@post_date_gmt,@post_content,@post_excerpt,@post_title,@post_name,'publish','shop_coupon',@to_ping, @pinged,@post_content_filtered,@post_mime_type);SELECT LAST_INSERT_ID();";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@post_date", DateTime.Now),
                    new MySqlParameter("@post_date_gmt", DateTime.UtcNow),
                    new MySqlParameter("@post_content", string.Empty),
                    new MySqlParameter("@post_excerpt", model.post_excerpt),
                    new MySqlParameter("@post_title", model.post_title),
                    new MySqlParameter("@post_name", model.post_name),
                    new MySqlParameter("@to_ping", string.Empty),
                    new MySqlParameter("@pinged", string.Empty),
                    new MySqlParameter("@post_content_filtered", string.Empty),
                    new MySqlParameter("@post_mime_type", string.Empty),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            } 
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public static int EditCoupons(CouponsModel model, long ID)
        {
            try
            {
                string strsql = "update wp_posts set post_excerpt=@post_excerpt  where ID =" + ID + "";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@post_excerpt", model.post_excerpt),
                    //new MySqlParameter("@post_title", model.post_title),
                    //new MySqlParameter("@post_name", model.post_name),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public static void AddCouponMeta(CouponsModel model, long id, string varFieldsName, string varFieldsValue)
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
        public static void UpdateMetaData(CouponsModel model, long id, string varFieldsName, string varFieldsValue)
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
        public static DataTable GetProducts(string strSearch)
        {
            DataTable DT = new DataTable();
            try
            {
                string strSQl = "SELECT DISTINCT post.id,ps.ID pr_id,CONCAT(post.post_title, ' (' , COALESCE(psku.meta_value,'') , ') - ' ,LTRIM(REPLACE(REPLACE(COALESCE(ps.post_excerpt,''),'Size:', ''),'Color:', ''))) as post_title"
                            + " , CONCAT(post.id, '$', COALESCE(ps.id, 0)) r_id FROM wp_posts as post"
                            + " LEFT OUTER JOIN wp_posts ps ON ps.post_parent = post.id and ps.post_type LIKE 'product_variation'"
                            + " left outer join wp_postmeta psku on psku.post_id = ps.id and psku.meta_key = '_sku'"
                            + " WHERE post.post_type = 'product' AND post.post_status = 'publish' AND CONCAT(post.post_title, ' (' , COALESCE(psku.meta_value,'') , ') - ' ,LTRIM(REPLACE(REPLACE(COALESCE(ps.post_excerpt,''),'Size:', ''),'Color:', ''))) like '%" + strSearch + "%' "
                            + " ORDER BY post.ID limit 50;";
                DT = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }
        public static DataTable GetProductcategoriesList(string strSearch)
        {
            DataTable DT = new DataTable();
            try
            {
                string strSQl = "Select * From wp_terms Left Join wp_term_taxonomy On wp_terms.term_id = wp_term_taxonomy.term_id"
                              + " WHERE wp_term_taxonomy.taxonomy = 'product_cat' and name like '%" + strSearch + "%' ";
                DT = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }

        public static DataTable GetCounts()
        {
            DataTable dt = new DataTable();
            try
            {
                string strWhr = string.Empty;

                string strSql = "select sum(case when post_status not in('auto-draft','trash') then 1 else 0 end) AllOrder,"
                            + " sum(case when post_author = 8 and  p.post_status != 'auto-draft'  then 1 else 0 end) Mine,"
                            + " sum(case when post_status = 'publish' then 1 else 0 end) Publish,"
                            + " sum(case when post_status = 'draft' then 1 else 0 end) Drafts,"
                            + " sum(case post_status when 'pending' then 1 else 0 end) Pending,sum(case post_status when 'private' then 1 else 0 end) Private,"
                            + " sum(case when post_status = 'trash' then 1 else 0 end) Trash"
                            + " from wp_posts p where p.post_type = 'shop_coupon'";

                dt = SQLHelper.ExecuteDataTable(strSql);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static DataTable GetList(string strValue1, string userstatus, string strValue3, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "order_id", string SortDir = "DESC")
       {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;
                if (strValue1 == "0")
                    strValue1 = "";

                if (!string.IsNullOrEmpty(userstatus))
                {
                    if (userstatus == "mine") { strWhr += " and P.post_author = 8 and P.post_status != 'auto-draft'"; }
                    else { strWhr += " and P.post_status = '" + userstatus + "'"; }
                }
                else
                    strWhr += " and P.post_status != 'auto-draft' ";
                if (userstatus != "trash")
                {
                    strWhr += " and P.post_status != 'trash' ";
                }
               if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (P.ID like '%" + searchid + "%' "
                            + " OR post_title like '%" + searchid + "%' "
                            + " OR pmdistype.meta_value like '%" + searchid + "%' "
                            + " OR post_excerpt like '%" + searchid + "%' "
                            + " OR pmproid.meta_value like '%" + searchid + "%' "
                            + " OR pmexdate.meta_value like '%" + searchid + "%' "
                                            
                            + " )";
                }


                if (!string.IsNullOrEmpty(strValue1))
                {
                   
                    strWhr += " and pmdistype.meta_value like '%" + strValue1 + "%' ";
                }

                string strSql = "SELECT P.ID ID, post_title,post_excerpt,case when pmdistype.meta_value = 'percent' then 'Percentage discount' when  pmdistype.meta_value = 'fixed_cart' then 'Fixed cart discount' else 'Fixed product discount' end discount_type ,case when pmproid.meta_value is null then '' else replace(pmproid.meta_value, ',', ', ') end product_ids,pmamount.meta_value coupon_amount,"
                            + "  from_unixtime(pmexdate.meta_value) date_expires,CONCAT(COALESCE(pmpuscount.meta_value,'0'),' / ',COALESCE(pmpuslimit.meta_value, '0' )) UsageLimit"
                            + " FROM wp_posts P"
                            + " left join wp_postmeta pmamount on P.ID = pmamount.post_id and pmamount.meta_key = 'coupon_amount'"
                            + " left join wp_postmeta pmexdate on P.ID = pmexdate.post_id and pmexdate.meta_key = 'date_expires'"
                            + " left join wp_postmeta pmdistype on P.ID = pmdistype.post_id and pmdistype.meta_key = 'discount_type'"
                            + " left join wp_postmeta pmproid on P.ID = pmproid.post_id and pmproid.meta_key = 'product_ids'"
                            + " left join wp_postmeta pmpuslimit on P.ID = pmpuslimit.post_id and pmpuslimit.meta_key = 'usage_limit'"
                            + " left join wp_postmeta pmpuscount on P.ID = pmpuscount.post_id and pmpuscount.meta_key = 'usage_count'"
                            + " WHERE P.post_type = 'shop_coupon'" + strWhr
                            + " order by " + SortCol + " " + SortDir + " limit " + (pageno).ToString() + ", " + pagesize + "";

                strSql += "; SELECT Count(distinct P.ID) TotalRecord from wp_posts P"
                         + " left join wp_postmeta pmexdate on P.ID = pmexdate.post_id and pmexdate.meta_key = 'date_expires'"
                            + " left join wp_postmeta pmdistype on P.ID = pmdistype.post_id and pmdistype.meta_key = 'discount_type'"
                            + " left join wp_postmeta pmproid on P.ID = pmproid.post_id and pmproid.meta_key = 'product_ids'"
                            + " left join wp_postmeta pmpuslimit on P.ID = pmpuslimit.post_id and pmpuslimit.meta_key = 'usage_limit'"
                            + " left join wp_postmeta pmpuscount on P.ID = pmpuscount.post_id and pmpuscount.meta_key = 'usage_count'"
                        + " WHERE P.post_type = 'shop_coupon'" + strWhr.ToString();
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

        public int ChangeTrash(OrderPostStatusModel model, string ID)
        {
            try
            {
                string strsql = string.Format("update wp_wc_order_stats set status=@status where order_id  in ({0}); ", ID)
                    + string.Format("update wp_posts set post_status=@status,post_modified=@post_modified,post_modified_gmt=@post_modified_gmt where id  in ({0}); ", ID);
                MySqlParameter[] para =
                {
                    new MySqlParameter("@status", model.status),
                    new MySqlParameter("@post_modified", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")),
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

        public static DataTable GetDataByID(OrderPostStatusModel model)
        {
            DataTable dt = new DataTable();

            try
            {
                string strWhr = string.Empty;

                string strSql = "SELECT P.ID ID, post_title, post_excerpt,pmdistype.meta_value discount_type, pmproid.meta_value product_ids, pmamount.meta_value coupon_amount,"
                             + "  from_unixtime(pmexdate.meta_value) date_expires,pmpuscount.meta_value usage_count,pmpuslimit.meta_value  usage_limit,pmfreesp.meta_value free_shipping,from_unixtime(pmdateexp.meta_value) date_expires,pmminimam.meta_value minimum_amount,"
                             + "  pmmaximam.meta_value maximum_amount,pmindividual.meta_value individual_use,pmexcludesaleitme.meta_value exclude_sale_items,pmautocp.meta_value _wjecf_is_auto_coupon,"
                             + "  pmexprdid.meta_value exclude_product_ids,pmcatg.meta_value product_categories,pmexcatg.meta_value exclude_product_categories,pmlimituser.meta_value usage_limit_per_user,pmcutemail.meta_value customer_email,pmlimituseritem.meta_value limit_usage_to_x_items"
                             + " FROM wp_posts P"
                             + " left join wp_postmeta pmamount on P.ID = pmamount.post_id and pmamount.meta_key = 'coupon_amount'"
                             + " left join wp_postmeta pmexdate on P.ID = pmexdate.post_id and pmexdate.meta_key = 'date_expires'"
                             + " left join wp_postmeta pmdistype on P.ID = pmdistype.post_id and pmdistype.meta_key = 'discount_type'"
                             + " left join wp_postmeta pmproid on P.ID = pmproid.post_id and pmproid.meta_key = 'product_ids'"
                             + " left join wp_postmeta pmpuslimit on P.ID = pmpuslimit.post_id and pmpuslimit.meta_key = 'usage_limit'"
                             + " left join wp_postmeta pmpuscount on P.ID = pmpuscount.post_id and pmpuscount.meta_key = 'usage_count'"
                             + " left join wp_postmeta pmfreesp on P.ID = pmfreesp.post_id and pmfreesp.meta_key = 'free_shipping'"
                             + " left join wp_postmeta pmdateexp on P.ID = pmdateexp.post_id and pmdateexp.meta_key = 'date_expires'"
                             + " left join wp_postmeta pmminimam on P.ID = pmminimam.post_id and pmminimam.meta_key = 'minimum_amount'"
                             + " left join wp_postmeta pmmaximam on P.ID = pmmaximam.post_id and pmmaximam.meta_key = 'maximum_amount'"
                             + " left join wp_postmeta pmindividual on P.ID = pmindividual.post_id and pmindividual.meta_key = 'individual_use'"
                             + " left join wp_postmeta pmexcludesaleitme on P.ID = pmexcludesaleitme.post_id and pmexcludesaleitme.meta_key = 'exclude_sale_items'"
                             + " left join wp_postmeta pmautocp on P.ID = pmautocp.post_id and pmautocp.meta_key = '_wjecf_is_auto_coupon'"
                             + " left join wp_postmeta pmexprdid on P.ID = pmexprdid.post_id and pmexprdid.meta_key = 'exclude_product_ids'"
                             + " left join wp_postmeta pmcatg on P.ID = pmcatg.post_id and pmcatg.meta_key = 'product_categories'"
                             + " left join wp_postmeta pmexcatg on P.ID = pmexcatg.post_id and pmexcatg.meta_key = 'exclude_product_categories'"
                             + " left join wp_postmeta pmlimituser on P.ID = pmlimituser.post_id and pmlimituser.meta_key = 'usage_limit_per_user'"
                             + " left join wp_postmeta pmlimituseritem on P.ID = pmlimituseritem.post_id and pmlimituseritem.meta_key = 'limit_usage_to_x_items'"
                             + " left join wp_postmeta pmcutemail on P.ID = pmcutemail.post_id and pmcutemail.meta_key = 'customer_email'"
                             + " WHERE P.post_type = 'shop_coupon' and P.ID = "+ model.strVal + " ";


                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dt = ds.Tables[0];

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataTable GetProdctByID(OrderPostStatusModel model)
        {
            DataTable dt = new DataTable();

            try
            {
                string strWhr = string.Empty;
                string strSQl = "SELECT DISTINCT post.id,ps.ID pr_id,CONCAT(post.post_title, ' (' , COALESCE(psku.meta_value,'') , ') - ' ,LTRIM(REPLACE(REPLACE(COALESCE(ps.post_excerpt,''),'Size:', ''),'Color:', ''))) as post_title"
                             + " , CONCAT(post.id, '$', COALESCE(ps.id, 0)) r_id FROM wp_posts as post"
                             + " LEFT OUTER JOIN wp_posts ps ON ps.post_parent = post.id and ps.post_type LIKE 'product_variation'"
                             + " left outer join wp_postmeta psku on psku.post_id = ps.id and psku.meta_key = '_sku'"
                             + " WHERE post.post_type = 'product' AND post.post_status = 'publish' and ps.id in (" + model.strVal + ") "
                             + " ORDER BY post.ID limit 50;";
                dt = SQLHelper.ExecuteDataTable(strSQl);   
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static DataTable GetCategoryProdctByID(OrderPostStatusModel model)
        {
            DataTable dt = new DataTable();

            try
            {
                string strWhr = string.Empty;

                string strSQl = "Select * From wp_terms Left Join wp_term_taxonomy On wp_terms.term_id = wp_term_taxonomy.term_id"
                              + " WHERE wp_term_taxonomy.taxonomy = 'product_cat' and wp_terms.term_id in (" + model.strVal + ")";
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