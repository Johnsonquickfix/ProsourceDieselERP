using LaylaERP.DAL;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using LaylaERP.Models;
using LaylaERP.UTILITIES;
using System.Text.RegularExpressions;

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

        public static int CreatePage(string qflag, string ID, string post_title, string post_content, string InnerPageBannerLink, string entity_id, string SEO, string Content,string featured_image_url, string fcsskey, string seotitle, string metades, string slug, string keylist, string synlist, string parent_id, string template, string order, string gmtkeyword, string comment)
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
                    new SqlParameter("@Content",Content),
                     new SqlParameter("@yoast_wpseo_focuskw",fcsskey),
                    new SqlParameter("@yoast_wpseo_title",seotitle),
                    new SqlParameter("@yoast_wpseo_metadesc",metades),
                    new SqlParameter("@yoast_wpseo_focuskeywords",keylist),
                    new SqlParameter("@yoast_wpseo_keywordsynonyms",synlist),
                    new SqlParameter("@parent_id",parent_id),
                    new SqlParameter("@template",template),
                    new SqlParameter("@order",order),
                     new SqlParameter("@gmtkeyword",gmtkeyword),
                    new SqlParameter("@comment",comment)
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

        public static int CreateBanner(string qflag, string ID, string post_title, string bannerurl, string FileName, string entity_id,string btypeof, string type, string featured_image_url, string Bannerhight, string Bannerwidth)
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
                     new SqlParameter("@Bannerhight",Bannerhight),
                     new SqlParameter("@Bannerwidth ",Bannerwidth)
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


        public static int CreatePost(string qflag, string ID, string post_title, string post_content, string InnerPageBannerLink, string entity_id, string Category,  string featured_image_url, string fcsskey, string seotitle, string metades, string slug, string keylist, string synlist)
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
                    new SqlParameter("@Category",Category),
                    new SqlParameter("@yoast_wpseo_focuskw",fcsskey),
                    new SqlParameter("@yoast_wpseo_title",seotitle),
                    new SqlParameter("@yoast_wpseo_metadesc",metades),
                    new SqlParameter("@yoast_wpseo_focuskeywords",keylist),
                    new SqlParameter("@yoast_wpseo_keywordsynonyms",synlist)
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

          public static DataTable GetParentCategoryList(string optType)
        {
            DataTable DS = new DataTable();
            try
            {
                SqlParameter[] parameters =
                 {
                    
                    new SqlParameter("@flag", "PageCategoryList"),
                    new SqlParameter("@parent",optType)
                };

                //string strSQl = "erp_ProductCategory";
                DS = SQLHelper.ExecuteDataTable("erp_ProductCategory", parameters);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }

        public static DataTable CategoryList(long id, string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strSQl = "erp_ProductCategory";
                SqlParameter[] para =
                {
                    new SqlParameter("@Flag", "CategoryPagesListWithParameter")
                };
                dt = SQLHelper.ExecuteDataTable(strSQl, para);

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataTable GetCategoryByID(long id)
        {
            DataTable dt = new DataTable();
            try
            {
                string strWhr = string.Empty;
                string strSql = "erp_ProductCategory";
                SqlParameter[] para =
               {
                    new SqlParameter("@Flag", "getpageProductCategoryByID"),
                    new SqlParameter("@term_id", id)
                    };
                DataSet ds = SQLHelper.ExecuteDataSet(strSql, para);
                dt = ds.Tables[0];
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public int EditPostCategory(ProductCategoryModel model, string name, string slug, string parent, string description, long thumbnailID)
        {
            try
            {
                string strsql = "";
                strsql = "update wp_terms set name=@name,slug=@slug where term_id=" + model.term_id + "; update wp_term_taxonomy set description=@description,parent=@parent where term_id=" + model.term_id + ";" +
                    " Update wp_termmeta set meta_value='" + model.display_type + "' where term_id=" + model.term_id + " and meta_key='display_type';";
                    //" Update wp_termmeta set meta_value='" + thumbnailID + "' where term_id=" + model.term_id + " and meta_key='thumbnail_id';";
                SqlParameter[] para =
                {
                    new SqlParameter("@name", model.name),
                    new SqlParameter("@slug",  Regex.Replace(model.slug, @"\s+", "")),
                    new SqlParameter("@parent", model.parent),
                    new SqlParameter("@description", model.description == null ? "" : model.description),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "CMS/AddPostCategory/" + model.parent + "", "Update post category meta data");
                throw Ex;
            }
        }

        public int AddPostCategoryDesc(ProductCategoryModel model, long term_id, int thumbnail_id)
        {
            try
            {
                string strsql = "";
                strsql = "erp_ProductCategory";
                SqlParameter[] para =
                {
                    new SqlParameter("@Flag", "AddPostCategoryDescription"),
                    new SqlParameter("@term_id", term_id),
                    new SqlParameter("@taxonomy", "category"),
                    new SqlParameter("@parent", model.parent),
                    new SqlParameter("@description", model.description == null ? "" : model.description),
                    new SqlParameter("@display_type", model.display_type.ToString()),
                    new SqlParameter("@thumbnail_id",thumbnail_id),

                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Product/AddProductCategory/" + "0" + "", "Add product category description");
                throw Ex;
            }
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
                    if (metaValue.CompareTo("0") != 0)
                    {
                        string[] value = metaValue.Split(',');
                        for (int i = 0; i <= value.Length - 1; i++)
                        {
                            var ProductID = value[i].ToString();
                            string strsql = "Delete r from wp_term_relationships r inner join wp_term_taxonomy t on t.term_id = r.term_taxonomy_id where t.taxonomy = 'category' and object_id =" + ProductID + "; " +
                                "Insert into wp_term_relationships(object_id, term_taxonomy_id, term_order) values(" + ProductID + ", 80, 0);";
                            result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql));
                        }
                    }
                    else
                    {
                        result = 0;
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
                UserActivityLog.ExpectionErrorLog(Ex, "CMS/DeleteCategorywithProduct/" + "0" + "", "Delete category with product");
                throw Ex;
            }
        }
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
                    string strSQl = "";
                    strSQl = "erp_ProductCategory";
                    SqlParameter[] para =
                    {
                    new SqlParameter("@Flag", "getpostTermID"),
                    new SqlParameter("@Userterm_ID", termID)

                   };
                    ds = SQLHelper.ExecuteDataSet(strSQl, para);

                    if (!string.IsNullOrEmpty(ds.Tables[0].Rows[0]["term_id"].ToString()))
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
                    string strSQl = "";
                    strSQl = "erp_ProductCategory";
                    SqlParameter[] para =
                       {
                        new SqlParameter("@Flag", "getpostID"),
                        new SqlParameter("@Userterm_ID", termID)
                       };
                    DataSet ds = SQLHelper.ExecuteDataSet(strSQl, para);
                    if (!string.IsNullOrEmpty(ds.Tables[0].Rows[0]["object_id"].ToString()))
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

        
        public static DataTable Getshortcode(string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;
                string strSql = "SELECT id,code,description,created_on from cms_shortcode WHERE 1=1";
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (code like '%" + searchid + "%' OR description like '%" + searchid + "%')";
                }
                if (userstatus != null)
                {
                    //strWhr += " and (is_active='" + userstatus + "') ";
                }
                strSql += strWhr + string.Format(" order by " + SortCol + " " + SortDir + " OFFSET " + (pageno).ToString() + " ROWS FETCH NEXT " + pagesize + " ROWS ONLY ");

                strSql += "; SELECT (Count(id)/" + pagesize.ToString() + ") TotalPage,Count(id) TotalRecord FROM cms_shortcode WHERE 1=1" + strWhr.ToString();

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

        public static int Addshortcode(string code, string disc,string id )
        {
            try
            {
                string qflag = "";
                if (Convert.ToInt32(id) > 0)
                    qflag = "U";
                else
                    qflag = "I";

                    SqlParameter[] para = {
                    new SqlParameter("@qflag",qflag),
                    new SqlParameter("@code",code),
                    new SqlParameter("@id",id),
                    new SqlParameter("@description",disc), 
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar("erp_shortcode_insert", para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static DataTable Selectshortcode(string strSearch)
        {
            DataTable DT = new DataTable();
            try
            {
                DT = SQLHelper.ExecuteDataTable("SELECT id, code, description from cms_shortcode WHERE id =" + strSearch + "");
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }

        public static DataTable Getapi(string entity_id, string client_secret, string post_status, string per_page, string page, string sort, string direction,string flag)
        {
            DataTable dt;
            try
            { 
                SqlParameter[] parameters =
              {

                    new SqlParameter("@post_status", post_status),
                   new SqlParameter("@searchcriteria", ""),
                    new SqlParameter("@strValue1", entity_id),
                    new SqlParameter("@pageno", page),
                    new SqlParameter("@pagesize", per_page),
                    new SqlParameter("@sortcol", sort),
                    new SqlParameter("@sortdir", direction),
                    new SqlParameter("@flag", flag)
                };

                dt = SQLHelper.ExecuteDataTable("cms_page_api", parameters);
                
            }
            catch { throw; }
            return dt;
        }

        public static DataSet Getparentpage(string id)
        {
            DataSet DS = new DataSet();
            try
            {
                string strSQl = "select case when post_parent <> 0 then '--'+ post_title else post_title end post_title,ID,post_parent from cms_posts where   post_type = 'page' and post_status = 'publish' order by ID,post_parent";
                 DS = SQLHelper.ExecuteDataSet(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }
        public static DataSet Getparentpagebyid(int id)
        {
            DataSet DS = new DataSet();
            try
            {
                string strSQl = "";
                if (id > 0)
                    strSQl = "select case when post_parent <> 0 then '--'+ post_title else post_title end post_title,ID,post_parent from cms_posts where   post_type = 'page' and post_status = 'publish' and entity_id = "+ id +" order by ID,post_parent";
                else
                     strSQl = "select case when post_parent <> 0 then '--'+ post_title else post_title end post_title,ID,post_parent from cms_posts where   post_type = 'page' and post_status = 'publish' order by ID,post_parent";

                DS = SQLHelper.ExecuteDataSet(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }
        public static DataTable GetpagebannerData(string optType, int id)
        {
            DataTable DS = new DataTable();
            try
            {
                string strSQl = "";
                if (id > 0)
                    strSQl = "Select ID, post_title label from cms_posts where post_type = 'page' and post_title like '%" + optType + "%' and entity_id = " + id + "";
                else
                    strSQl = "Select ID, post_title label from cms_posts where post_type = 'page' and post_title like '%" + optType + "%';";
                DS = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }
    }
}