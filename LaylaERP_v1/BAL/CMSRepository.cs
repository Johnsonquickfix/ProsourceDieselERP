using LaylaERP.DAL;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LaylaERP.BAL
{
    public class CMSRepository  
    {
        public static DataTable GetCounts()
        {
            DataTable dt = new DataTable();
            try
            {
                string strWhr = string.Empty;
                SqlParameter[] para = { new SqlParameter("@qflag", "CNT"), };
                string strSql = "cms_countpages"; 
                dt = SQLHelper.ExecuteDataTable(strSql, para);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataTable GetList(string strValue1, string userstatus, string strValue3, string strValue4, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "ID", string SortDir = "DESC")
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
                    new SqlParameter("@pageno", pageno),
                    new SqlParameter("@pagesize", pagesize),
                    new SqlParameter("@sortcol", SortCol),
                    new SqlParameter("@sortdir", SortDir),
                    new SqlParameter("@flag", "PLS")
                };

                DataSet ds = SQLHelper.ExecuteDataSet("cms_page_search", parameters);
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

        public static DataTable GetDataByID(int ID)
        {
            DataTable dt = new DataTable();

            try
            {
                string strWhr = string.Empty;

                SqlParameter[] parameters =
                 {
                    new SqlParameter("@condition", ""),
                    new SqlParameter("@flag", "ByID"),
                    new SqlParameter("@id",ID),
                };
                DataTable ds = new DataTable();
                dt = DAL.SQLHelper.ExecuteDataTable("cms_pagebyid", parameters);

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static int CreatePage(string qflag, string ID, string post_title, string post_content, string InnerPageBannerLink, string entity_id, string SEO, string Content,string featured_image_url)
        {
            try
            {
                SqlParameter[] para = {
                    new SqlParameter("@qflag",qflag),
                    new SqlParameter("@ID", ID),
                    new SqlParameter("@post_title",post_title),
                    new SqlParameter("@post_content",post_content),
                    new SqlParameter("@InnerPageBannerLink",InnerPageBannerLink),
                    new SqlParameter("@featured_image_url",featured_image_url),
                    new SqlParameter("@entity_id",entity_id) ,
                    new SqlParameter("@SEO",SEO),
                    new SqlParameter("@Content",Content)
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar("cms_pages_iud", para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static DataTable GetBannerCount()
        {
            DataTable dt = new DataTable();
            try
            {
                string strWhr = string.Empty;
                SqlParameter[] para = { new SqlParameter("@qflag", "CNT"), };
                string strSql = "cms_countpages";
                dt = SQLHelper.ExecuteDataTable(strSql, para);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataTable GetBannerList(string strValue1, string userstatus, string strValue3, string strValue4, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "ID", string SortDir = "DESC")
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
                    new SqlParameter("@pageno", pageno),
                    new SqlParameter("@pagesize", pagesize),
                    new SqlParameter("@sortcol", SortCol),
                    new SqlParameter("@sortdir", SortDir),
                    new SqlParameter("@flag", "PLS")
                };

                DataSet ds = SQLHelper.ExecuteDataSet("cms_page_search", parameters);
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

        public static DataTable GetBannerDataByID(int ID)
        {
            DataTable dt = new DataTable();

            try
            {
                string strWhr = string.Empty;

                SqlParameter[] parameters =
                 {
                    new SqlParameter("@condition", ""),
                    new SqlParameter("@flag", "ByID"),
                    new SqlParameter("@id",ID),
                };
                DataTable ds = new DataTable();
                dt = DAL.SQLHelper.ExecuteDataTable("cms_pagebyid", parameters);

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static int CreateBanner(string qflag, string ID, string post_title, string post_content, string InnerPageBannerLink, string entity_id, string SEO, string Content)
        {
            try
            {
                SqlParameter[] para = {
                    new SqlParameter("@qflag",qflag),
                    new SqlParameter("@ID", ID),
                    new SqlParameter("@post_title",post_title),
                    new SqlParameter("@post_content",post_content),
                    new SqlParameter("@InnerPageBannerLink",InnerPageBannerLink),
                    new SqlParameter("@entity_id",entity_id) ,
                    new SqlParameter("@SEO",SEO),
                    new SqlParameter("@Content",Content)
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar("cms_pages_iud", para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static DataTable GetpageData(string optType)
        {
            DataTable DS = new DataTable();
            try
            {
                string strSQl = "Select ID, post_title label from cms_posts where post_type = 'page' and post_title like '%"+optType+"%';";
                DS = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }

    }
}