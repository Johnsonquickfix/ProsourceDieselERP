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
                SqlParameter[] para = { new SqlParameter("@qflag", "CNTBN"), };
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
                    new SqlParameter("@flag", "BLS")
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
                dt = DAL.SQLHelper.ExecuteDataTable("cms_bannerbyid", parameters);

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        //public static int CreateBanner(string qflag, string ID, string post_title, string post_content, string InnerPageBannerLink, string entity_id, string SEO, string Content)
        //{
        //    try
        //    {
        //        SqlParameter[] para = {
        //            new SqlParameter("@qflag",qflag),
        //            new SqlParameter("@ID", ID),
        //            new SqlParameter("@post_title",post_title),
        //            new SqlParameter("@post_content",post_content),
        //            new SqlParameter("@InnerPageBannerLink",InnerPageBannerLink),
        //            new SqlParameter("@entity_id",entity_id) ,
        //            new SqlParameter("@SEO",SEO),
        //            new SqlParameter("@Content",Content)
        //        };
        //        int result = Convert.ToInt32(SQLHelper.ExecuteScalar("cms_pages_iud", para));
        //        return result;
        //    }
        //    catch (Exception Ex)
        //    {
        //        throw Ex;
        //    }
        //}

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
        public static DataTable GetcategoryData(string optType)
        {
            DataTable DS = new DataTable();
            try
            {
                string strSQl = "SELECT t.term_id ID, name label FROM wp_term_taxonomy tx left join wp_terms t on t.term_id = tx.term_id WHERE taxonomy='product_cat' and name like '%" + optType + "%';";
                DS = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }

        public static int CreateBanner(string qflag, string ID, string post_title, string bannerurl, string FileName, string entity_id,string btypeof, string type, string featured_image_url)
        {
            try
            {
                SqlParameter[] para = {
                    new SqlParameter("@qflag",qflag),
                    new SqlParameter("@ID", ID),
                    new SqlParameter("@post_title",post_title),
                    new SqlParameter("@InnerPageBannerLink",bannerurl),
                    new SqlParameter("@for_mobile",FileName),
                    new SqlParameter("@InnerPageBannerImage",featured_image_url),
                    new SqlParameter("@InnerPageBannerType",btypeof) ,
                     new SqlParameter("@entity_id",entity_id), 
                     new SqlParameter("@InnerPageBannerSelection",type),
                    //new SqlParameter("@Content",Content)
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar("cms_banner_iud", para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static DataTable GetPostCount()
        {
            DataTable dt = new DataTable();
            try
            {
                string strWhr = string.Empty;
                SqlParameter[] para = { new SqlParameter("@qflag", "CNTPT"), };
                string strSql = "cms_countpages";
                dt = SQLHelper.ExecuteDataTable(strSql, para);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataTable GetPostList(string strValue1, string userstatus, string strValue3, string strValue4, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "ID", string SortDir = "DESC")
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
                    new SqlParameter("@flag", "PST")
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

        public static DataTable GetParentCategory(string term_taxonomy_id)
        {
            DataTable DS = new DataTable();
            try
            {

                string strSQl = "erp_ProductCategory";
                SqlParameter[] para =
                {
                    new SqlParameter("@Flag", "CategoryPostList")
                };
                DS = SQLHelper.ExecuteDataTable(strSQl, para);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }


        public static DataTable GetPostDataByID(int ID)
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
                dt = DAL.SQLHelper.ExecuteDataTable("cms_postbyid", parameters);

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }


        public static int CreatePost(string qflag, string ID, string post_title, string post_content, string InnerPageBannerLink, string entity_id, string Category,  string featured_image_url)
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
                    new SqlParameter("@Category",Category)
                    //new SqlParameter("@Content",Content)
                };

                int result = Convert.ToInt32(SQLHelper.ExecuteScalar("cms_post_iud", para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public string GetCountforupdate(long PostID)
        {
            string result = "";
            DataTable dt = new DataTable();
            try
            {
                string strSQl = "select string_agg(tm. term_taxonomy_id,',') ID from wp_term_relationships tr inner join wp_term_taxonomy tm on tm. term_taxonomy_id = tr.term_taxonomy_id  and taxonomy = 'product'  WHERE object_id =" + PostID + "; ";
                result = SQLHelper.ExecuteScalar(strSQl).ToString();
                //return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }

        public static DataTable ParentCategory(string optType)
        {
            DataTable DS = new DataTable();
            try
            {
                SqlParameter[] parameters =
                 {
                    
                    new SqlParameter("@flag", "CategoryProductList"),
                    new SqlParameter("@parent",optType)
                };

                //string strSQl = "erp_ProductCategory";
                DS = SQLHelper.ExecuteDataTable("erp_ProductCategory", parameters);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }

    }
}