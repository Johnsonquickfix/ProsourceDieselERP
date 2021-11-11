using LaylaERP.DAL;
using LaylaERP.Models;
using LaylaERP.UTILITIES;
using System.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;

namespace LaylaERP.BAL
{
    public class CouponsRepository
    {
       
        public static int AddCoupons(CouponsModel model)
        {
            try
            {
                DataTable dt = new DataTable();
                //string strsql = "Insert into wp_posts(post_date,post_date_gmt,post_content,post_excerpt,post_title,post_name,post_status,post_type,to_ping, pinged,post_content_filtered,post_mime_type) values(@post_date,@post_date_gmt,@post_content,@post_excerpt,@post_title,@post_name,'publish','shop_coupon',@to_ping, @pinged,@post_content_filtered,@post_mime_type);SELECT LAST_INSERT_ID();";
                SqlParameter[] para =
                {
                    new SqlParameter("@qflag", "I"),
                    new SqlParameter("@post_date", DateTime.Now),
                    new SqlParameter("@post_date_gmt", DateTime.UtcNow),
                    new SqlParameter("@post_content", string.Empty),
                    new SqlParameter("@post_excerpt", model.post_excerpt),
                    new SqlParameter("@post_title", model.post_title),
                    new SqlParameter("@post_name", model.post_name),
                    new SqlParameter("@to_ping", string.Empty),
                    new SqlParameter("@pinged", string.Empty),
                    new SqlParameter("@post_content_filtered", string.Empty),
                    new SqlParameter("@post_mime_type", string.Empty),
                };
                dt = SQLHelper.ExecuteDataTable("erp_Coupon_iud", para);
                int result = Convert.ToInt32(dt.Rows[0]["id"]);
                //int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            } 
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public static int AddAutoCoupons(CouponsModel model)
        {
            try
            {
                string strsql = "Insert into wp_posts_Coupons(post_date,post_date_gmt,post_content,post_excerpt,post_title,post_name,post_status,post_type,to_ping, pinged,post_content_filtered,post_mime_type) values(@post_date,@post_date_gmt,@post_content,@post_excerpt,@post_title,@post_name,'publish','shop_coupon',@to_ping, @pinged,@post_content_filtered,@post_mime_type);SELECT LAST_INSERT_ID();";
                SqlParameter[] para =
                {
                    new SqlParameter("@post_date", DateTime.Now),
                    new SqlParameter("@post_date_gmt", DateTime.UtcNow),
                    new SqlParameter("@post_content", string.Empty),
                    new SqlParameter("@post_excerpt", model.post_excerpt),
                    new SqlParameter("@post_title", model.post_title),
                    new SqlParameter("@post_name", model.post_name),
                    new SqlParameter("@to_ping", string.Empty),
                    new SqlParameter("@pinged", string.Empty),
                    new SqlParameter("@post_content_filtered", string.Empty),
                    new SqlParameter("@post_mime_type", string.Empty),
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
                string strsql = "erp_Coupon_iud";
                SqlParameter[] para =
                {
                    new SqlParameter("@qflag", "U"),
                    new SqlParameter("@post_excerpt", model.post_excerpt),
                    new SqlParameter("@id", model.ID),
                    //new SqlParameter("@post_title", model.post_title),
                    //new SqlParameter("@post_name", model.post_name),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public static int EditAutoCoupons(CouponsModel model, long ID)
        {
            try
            {
                string strsql = "update wp_posts_Coupons set post_excerpt=@post_excerpt  where ID =" + ID + "";
                SqlParameter[] para =
                {
                    new SqlParameter("@post_excerpt", model.post_excerpt),
                    //new SqlParameter("@post_title", model.post_title),
                    //new SqlParameter("@post_name", model.post_name),
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
                // string strsql = "Insert into wp_postmeta(post_id,meta_key,meta_value) values(@post_id,@meta_key,@meta_value); select LAST_INSERT_ID() as ID;";

                string strsql = "erp_Coupon_iud"; 
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

        public static void AddAutoCouponMeta(CouponsModel model, long id, string varFieldsName, string varFieldsValue)
        {
            try
            {
                string strsql = "Insert into wp_postmeta_coupons(post_id,meta_key,meta_value) values(@post_id,@meta_key,@meta_value); select LAST_INSERT_ID() as ID;";
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
        public static void AddexpiresMeta(CouponsModel model, long id, string varFieldsName, string varFieldsValue)
        {
            try
            {
                string strsql = "erp_Coupon_iud";
                SqlParameter[] para =
                {
                     new SqlParameter("@qflag", "IME"),
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
        public static void AddAutoexpiresMeta(CouponsModel model, long id, string varFieldsName, string varFieldsValue)
        {
            try
            {
                string strsql = "Insert into wp_postmeta_coupons(post_id,meta_key,meta_value) values(@post_id,@meta_key,UNIX_TIMESTAMP(STR_TO_DATE(@meta_value, '%m/%d/%Y'))); select LAST_INSERT_ID() as ID;";
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
        public static void UpdateMetaData(CouponsModel model, long id, string varFieldsName, string varFieldsValue)
        {
            try
            {
                string strsql = "erp_Coupon_iud";
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
                throw Ex;
            }
        }
        public static void UpdateAutoMetaData(CouponsModel model, long id, string varFieldsName, string varFieldsValue)
        {
            try
            {
                string strsql = "update wp_postmeta_coupons set meta_value=@meta_value where post_id=@post_id and meta_key=@meta_key";
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
        public static void UpdateExpiresData(CouponsModel model, long id, string varFieldsName, string varFieldsValue)
        {
            try
            {
                string strsql = "erp_Coupon_iud";
                SqlParameter[] para =
                {
                    new SqlParameter("@qflag", "UME"),
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
        public static void UpdateAutoExpiresData(CouponsModel model, long id, string varFieldsName, string varFieldsValue)
        {
            try
            {
                string strsql = "update wp_postmeta_coupons set meta_value=UNIX_TIMESTAMP(STR_TO_DATE(@meta_value, '%m/%d/%Y'))  where post_id=@post_id and meta_key=@meta_key";
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

                SqlParameter[] parameters =
               {
                    new SqlParameter("@flag", "coupon")
                };
                
                dt = SQLHelper.ExecuteDataTable("wp_getcount", parameters);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataTable GetListUserType(string Expiredate, int userid,string strValue1, string userstatus, string strValue3, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "order_id", string SortDir = "DESC")
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
                 if (userid > 0)
                {

                    strWhr += " and pmempid.meta_value = " + userid + " ";
                }
                if (!string.IsNullOrEmpty(Expiredate))
                {

                    strWhr += " and format(cast(DATEADD(SECOND, convert(int, pmexdate.meta_value), '1970-01-01')  as date), 'MM/dd/yyyy') = '" + Expiredate + "' ";
                }
                string strSql = "SELECT P.ID ID, post_title,post_excerpt,case when pmdistype.meta_value = 'percent' then 'Percentage discount' when  pmdistype.meta_value = 'fixed_cart' then 'Fixed cart discount' else 'Fixed product discount' end discount_type ,case when pmproid.meta_value is null then '' else replace(pmproid.meta_value, ',', ', ') end product_ids,pmamount.meta_value coupon_amount,"
                            + "  case when pmexdate.meta_value = '' then '' else format(cast(DATEADD(SECOND, convert(int, pmexdate.meta_value), '1970-01-01')  as date), 'MM/dd/yyyy') end date_expires,CONCAT(COALESCE(pmpuscount.meta_value,'0'),' / ',COALESCE(pmpuslimit.meta_value, '0' )) UsageLimit"
                            + " FROM wp_posts P"
                            + " left join wp_postmeta pmamount on P.ID = pmamount.post_id and pmamount.meta_key = 'coupon_amount'"
                            + " left join wp_postmeta pmexdate on P.ID = pmexdate.post_id and pmexdate.meta_key = 'date_expires'"
                            + " left join wp_postmeta pmdistype on P.ID = pmdistype.post_id and pmdistype.meta_key = 'discount_type'"
                            + " left join wp_postmeta pmproid on P.ID = pmproid.post_id and pmproid.meta_key = 'product_ids'"
                            + " left join wp_postmeta pmpuslimit on P.ID = pmpuslimit.post_id and pmpuslimit.meta_key = 'usage_limit'"
                            + " left join wp_postmeta pmpuscount on P.ID = pmpuscount.post_id and pmpuscount.meta_key = 'usage_count'"
                            + " left join wp_postmeta pmempid on P.ID = pmempid.post_id and pmempid.meta_key = '_employee_id'"
                            + " WHERE P.post_type = 'shop_coupon'" + strWhr
                            + " order by " + SortCol + " " + SortDir + " OFFSET " + (pageno).ToString() + " ROWS FETCH NEXT " + pagesize + " ROWS ONLY;";

                strSql += "; SELECT Count(distinct P.ID) TotalRecord from wp_posts P"
                         + " left join wp_postmeta pmexdate on P.ID = pmexdate.post_id and pmexdate.meta_key = 'date_expires'"
                            + " left join wp_postmeta pmdistype on P.ID = pmdistype.post_id and pmdistype.meta_key = 'discount_type'"
                            + " left join wp_postmeta pmproid on P.ID = pmproid.post_id and pmproid.meta_key = 'product_ids'"
                            + " left join wp_postmeta pmpuslimit on P.ID = pmpuslimit.post_id and pmpuslimit.meta_key = 'usage_limit'"
                            + " left join wp_postmeta pmpuscount on P.ID = pmpuscount.post_id and pmpuscount.meta_key = 'usage_count'"
                            + " left join wp_postmeta pmempid on P.ID = pmempid.post_id and pmempid.meta_key = '_employee_id'"
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

                string strSql = "SELECT   P.ID ID, post_title,post_excerpt,case when pmdistype.meta_value = 'percent' then 'Percentage discount' when pmdistype.meta_value = 'fixed_cart' then 'Fixed cart discount' else 'Fixed product discount' end discount_type ,"
                            + "  case when pmproid.meta_value is null then '' else replace(pmproid.meta_value, ',', ', ') end product_ids,pmamount.meta_value coupon_amount, case when pmexdate.meta_value = '' then '' else format(cast(DATEADD(SECOND, convert(int, pmexdate.meta_value), '1970-01-01')  as date), 'MM/dd/yyyy') end date_expires,CONCAT(COALESCE(pmpuscount.meta_value,'0'),' / ',COALESCE(pmpuslimit.meta_value, '0' )) UsageLimit "
                            + " FROM wp_posts P"
                            + " left join wp_postmeta pmamount on P.ID = pmamount.post_id and pmamount.meta_key = 'coupon_amount'"
                            + " left join wp_postmeta pmexdate on P.ID = pmexdate.post_id and pmexdate.meta_key = 'date_expires'"
                            + " left join wp_postmeta pmdistype on P.ID = pmdistype.post_id and pmdistype.meta_key = 'discount_type'"
                            + " left join wp_postmeta pmproid on P.ID = pmproid.post_id and pmproid.meta_key = 'product_ids'"
                            + " left join wp_postmeta pmpuslimit on P.ID = pmpuslimit.post_id and pmpuslimit.meta_key = 'usage_limit'"
                            + " left join wp_postmeta pmpuscount on P.ID = pmpuscount.post_id and pmpuscount.meta_key = 'usage_count'"
                            + " WHERE P.post_type = 'shop_coupon'" + strWhr
                            //+ " order by " + SortCol + " " + SortDir + " limit " + (pageno).ToString() + ", " + pagesize + ""
                            +" order by " + SortCol + " " + SortDir + " OFFSET " + (pageno).ToString() + " ROWS FETCH NEXT " + pagesize + " ROWS ONLY;";

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

        public static DataTable AutoGenerateGetList(string strValue1, string userstatus, string strValue3, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "order_id", string SortDir = "DESC")
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

                string strSql = "SELECT P.ID ID, post_title,post_excerpt,case when convert(varchar, pmdistype.meta_value) = 'percent' then 'Percentage discount' when convert(varchar,pmdistype.meta_value) = 'fixed_cart' then 'Fixed cart discount' else 'Fixed product discount' end as discount_type ,case when pmproid.meta_value is null then '' else replace(pmproid.meta_value, ',', ', ') end product_ids,pmamount.meta_value coupon_amount,"
                            + "  case when pmexdate.meta_value = '' then '' else format(cast(DATEADD(SECOND, convert(int, pmexdate.meta_value), '1970-01-01')  as date), 'MM/dd/yyyy') end date_expires,CONCAT(COALESCE(pmpuscount.meta_value,'0'),' / ',COALESCE(pmpuslimit.meta_value, '0' )) UsageLimit"
                            + " FROM wp_posts_Coupons P"
                            + " left join wp_postmeta_coupons pmamount on P.ID = pmamount.post_id and pmamount.meta_key = 'coupon_amount'"
                            + " left join wp_postmeta_coupons pmexdate on P.ID = pmexdate.post_id and pmexdate.meta_key = 'date_expires'"
                            + " left join wp_postmeta_coupons pmdistype on P.ID = pmdistype.post_id and pmdistype.meta_key = 'discount_type'"
                            + " left join wp_postmeta_coupons pmproid on P.ID = pmproid.post_id and pmproid.meta_key = 'product_ids'"
                            + " left join wp_postmeta_coupons pmpuslimit on P.ID = pmpuslimit.post_id and pmpuslimit.meta_key = 'usage_limit'"
                            + " left join wp_postmeta_coupons pmpuscount on P.ID = pmpuscount.post_id and pmpuscount.meta_key = 'usage_count'"
                            + " WHERE P.post_type = 'shop_coupon'" + strWhr
                            + " order by " + SortCol + " " + SortDir + " OFFSET " + (pageno).ToString() + " ROWS FETCH NEXT " + pagesize + " ROWS ONLY;";

                strSql += "; SELECT Count(distinct P.ID) TotalRecord from wp_posts_Coupons P"
                         + " left join wp_postmeta_coupons pmexdate on P.ID = pmexdate.post_id and pmexdate.meta_key = 'date_expires'"
                            + " left join wp_postmeta_coupons pmdistype on P.ID = pmdistype.post_id and pmdistype.meta_key = 'discount_type'"
                            + " left join wp_postmeta_coupons pmproid on P.ID = pmproid.post_id and pmproid.meta_key = 'product_ids'"
                            + " left join wp_postmeta_coupons pmpuslimit on P.ID = pmpuslimit.post_id and pmpuslimit.meta_key = 'usage_limit'"
                            + " left join wp_postmeta_coupons pmpuscount on P.ID = pmpuscount.post_id and pmpuscount.meta_key = 'usage_count'"
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
                SqlParameter[] para =
                {
                    new SqlParameter("@status", model.status),
                    new SqlParameter("@post_modified", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")),
                    new SqlParameter("@post_modified_gmt", DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss"))
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
                SqlParameter[] parameters =
               {
                    new SqlParameter("@ID", model.strVal),
                    new SqlParameter("@flag", "coupon")
                };

                DataSet ds = SQLHelper.ExecuteDataSet("wp_couponsdatabyid", parameters);
                dt = ds.Tables[0];

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataTable GetAutoDataByID(OrderPostStatusModel model)
        {
            DataTable dt = new DataTable();

            try
            {
                string strWhr = string.Empty;

                SqlParameter[] parameters =
         {
                    new SqlParameter("@ID", model.strVal),
                    new SqlParameter("@flag", "autocoupon")
                };

                DataSet ds = SQLHelper.ExecuteDataSet("wp_couponsdatabyid", parameters);
                //DataSet ds = SQLHelper.ExecuteDataSet(strSql);
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

        public static DataTable GetProductList(string strSearch)
        {
            DataTable DT = new DataTable();
            try
            {                 
                DT = SQLHelper.ExecuteDataTable("wp_ddl_productlist");
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }
        public static DataTable GetSelectProdctByID(OrderPostStatusModel model)
        {
            DataTable dt = new DataTable();

            try
            {
                string strWhr = string.Empty;
                string strSQl = "SELECT p.id pr_id,CONCAT(p.post_title, COALESCE(CONCAT(' (',s.meta_value,')'),'')) post_title FROM wp_posts AS p "
                             + " left join wp_postmeta as s on p.id = s.post_id and s.meta_key = '_sku' "
                             + " WHERE p.post_type in ('product','product_variation') AND p.post_status != 'draft' and p.id in (" + model.strVal + ") "
                             + " group by p.id  ORDER BY p.ID;";
                dt = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataTable GetDuplicateCoupons(CouponsModel model)
        {
            DataTable dt = new DataTable();
            try
            {
                string strSQl = "select post_title from wp_posts"
                                + " WHERE post_type = 'shop_coupon' and post_title = '" + model.post_title + "' "
                                + ";";
                dt = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataTable GetDuplicateAutoCoupons(CouponsModel model)
        {
            DataTable dt = new DataTable();
            try
            {
                string strSQl = "select post_title from wp_posts_Coupons"
                                + " WHERE post_type = 'shop_coupon' and post_title = '" + model.post_title + "' "
                                + " limit 10;";
                dt = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static DataTable GetDuplicateCouponsMonth(string monthyear)
        {
            DataTable dt = new DataTable();
            try
            {
                string strSQl = "select month_type from wp_Coupons_month"
                                     + " WHERE month_type = '" + monthyear + "' "
                                     + " ";
                dt = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public long CoupanAutogenrate(string code, string ExpireDate)
        {
            long result = 0;
            try
            {
                DateTime cDate = CommonDate.CurrentDate(), cUTFDate = CommonDate.UtcDate();
                StringBuilder strSql = new StringBuilder();

                strSql.Append(string.Format("insert into wp_posts(post_author,post_date,post_date_gmt,post_content,post_title,post_excerpt,post_status,comment_status,ping_status,post_password,post_name,to_ping,pinged,post_modified,post_modified_gmt,post_content_filtered,post_parent,guid,menu_order,post_type,post_mime_type,comment_count,qb_sync,qb_refund_sync) (select post_author,'" + cDate.ToString("yyyy-MM-dd HH:mm:ss") + "','" + cDate.ToString("yyyy-MM-dd HH:mm:ss") + "',post_content, concat(post_title , '" + code + "') post_title ,post_excerpt,post_status,comment_status,ping_status,post_password,post_name,to_ping,pinged,post_modified,post_modified_gmt,post_content_filtered,ID,guid,menu_order,post_type,post_mime_type,comment_count,qb_sync,qb_refund_sync from wp_posts_Coupons);"));
                strSql.Append(string.Format("insert into wp_postmeta (post_id,meta_key,meta_value)(select wp.id pid,meta_key, case when meta_key = 'date_expires' then convert(varchar(200), DATEDIFF(SECOND, '1970-01-01','" + ExpireDate+ "'))  else meta_value end meta_value from wp_postmeta_coupons inner join wp_posts_Coupons on wp_posts_Coupons.id = wp_postmeta_coupons.post_id inner join wp_posts wp on wp.post_parent = wp_posts_Coupons.ID and wp.post_type = 'shop_coupon' and wp.post_title like '%" + code + "%'); "));
                strSql.Append(string.Format("insert into wp_Coupons_month (month_type) values ('{0}'); ", code));
              result = SQLHelper.ExecuteNonQuery(strSql.ToString());
                //string strsql = "erp_Coupon_iud";
                //SqlParameter[] para =
                //{
                //    new SqlParameter("@qflag", "IAU"),                    
                //    new SqlParameter("@code", code),
                //    new SqlParameter("@ExpireDate", ExpireDate),
                //    new SqlParameter("@cDate", cDate),              
                //};
               // int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));

               // result = SQLHelper.ExecuteNonQuery(strSql.ToString());

               // string query = strSql.ToString();

            }
            catch (Exception Ex)
            {
                throw Ex;
            }
            return result;
        }

        public static DataTable GetUser()
        {
            DataTable DT = new DataTable();
            try
            {
                string sqlquery = "select ID rowid,CONCAT(umfn.meta_value, ' ',COALESCE(umln.meta_value,'')) name"
                                 + " from wp_users u"
                                 + " inner join wp_usermeta um on um.user_id = u.id and um.meta_key = 'wp_capabilities' and meta_value NOT LIKE '%customer%' and meta_value not like '%a:2%' and meta_value not like '%a:5%' and meta_value not like '%a:0%' and  meta_value not like '%a:8%'"
                                 + " LEFT OUTER JOIN wp_usermeta umfn on umfn.meta_key = 'first_name' And umfn.user_id = u.ID"
                                 + " LEFT OUTER JOIN wp_usermeta umln on umln.meta_key = 'last_name' And umln.user_id = u.ID"
                                 + " WHERE user_status = 0 and umfn.meta_value <> ''  ORDER BY ID ASC;";

                DT = SQLHelper.ExecuteDataTable(sqlquery);
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }

    }

}