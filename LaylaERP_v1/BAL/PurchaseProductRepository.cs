using LaylaERP.DAL;
using LaylaERP.Models;
using LaylaERP.UTILITIES;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Web;

namespace LaylaERP.BAL
{
    public class PurchaseProductRepository
    {
        public static DataTable GetCounts()
        {
            DataTable dt = new DataTable();
            try
            {
                string strWhr = string.Empty;
               
                string strSql = "select sum(case when post_status not in('auto-draft') then 1 else 0 end) AllOrder,"
                          + " sum(case when post_status = 'publish' then 1 else 0 end) Publish,"
                          + " sum(case when post_status = 'publish' then 1 else 0 end)+sum(case post_status when 'private' then 1 else 0 end) Private,"
                          + " sum(case when post_status = 'trash' then 1 else 0 end) Trash"
                          + " from wp_posts p where p.post_type = 'purchase_product' and post_status != 'draft'"; 
                dt = SQLHelper.ExecuteDataTable(strSql);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
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

                DataSet ds = SQLHelper.ExecuteDataSet("cms_purchase_product_search", parameters);
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

        public int UpdateproductcomponentStatus(AccountingJournalModel model)
        { 
            int result = 0;
            try
            {
                string strSql_insert = string.Empty;
                StringBuilder strSql = new StringBuilder();                
                string res = string.Empty;

            SqlParameter[] parameters =
           {
                     new SqlParameter("@ID", model.rowid),
                    new SqlParameter("@status", model.active),
                 };
                res = SQLHelper.ExecuteScalar("erp_updateproductcomponent", parameters).ToString();
                 if (res.StartsWith("Success"))
                    result = 1; 
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
            return result;
        }

        public int Changestatus(OrderPostStatusModel model, string ID)
        {
            try
            {
                string strsql = string.Format("update wp_posts set post_status=@status,post_modified_gmt=@post_modified_gmt where id  in ({0}); ", ID);
                SqlParameter[] para =
                {
                    new SqlParameter("@status", model.status),
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

        public static DataSet getvariationdetailsbyid(OrderPostStatusModel model)
        {
            DataSet ds = new DataSet();
            try
            {
                string strWhr = string.Empty;
                SqlParameter[] para = { new SqlParameter("@strVal", model.strVal), };
                string strSql = "cms_getpurchasevariationdetailsbyid";

                ds = SQLHelper.ExecuteDataSet(strSql, para);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }
        public static int EditProducts(ProductModel model, long ID)
        {
            try
            {
                string strsql = "erp_product_iud";
                SqlParameter[] para =
                {
                    new SqlParameter("@qflag", "UPP"),
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

        public static DataSet GetDataByID(OrderPostStatusModel model)
        {
            DataSet ds = new DataSet();
            try
            {
                string strWhr = string.Empty;
                SqlParameter[] para = { new SqlParameter("@strVal", model.strVal), };
                string strSql = "erp_getpurchaseproductdetailsbyid";

                ds = SQLHelper.ExecuteDataSet(strSql, para);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }

        public static DataSet Getlatestattributesbyid(OrderPostStatusModel model)
        {
            DataSet ds = new DataSet();
            try
            {
                string strWhr = string.Empty;
                SqlParameter[] para = { new SqlParameter("@strVal", model.strVal), };
                string strSql = "cms_getpurvariationattbyid";

                ds = SQLHelper.ExecuteDataSet(strSql, para);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }
    }
}