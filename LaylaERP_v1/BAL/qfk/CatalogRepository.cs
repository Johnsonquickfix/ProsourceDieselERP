namespace LaylaERP.BAL.qfk
{
    using LaylaERP.DAL;
    using System;
    using System.Data;
    using System.Data.SqlClient;

    public class CatalogRepository
    {
        public static string SourceAdd(string flag, long company_id, long user_id, long id, string json_data)
        {
            string str = "{}";
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag", flag),
                    company_id > 0 ? new SqlParameter("@company_id",company_id) : new SqlParameter("@company_id",DBNull.Value),
                    id > 0 ? new SqlParameter("@id",id) : new SqlParameter("@id",DBNull.Value),
                    user_id > 0 ? new SqlParameter("@user_id",user_id) : new SqlParameter("@user_id", DBNull.Value),
                    !string.IsNullOrEmpty(json_data) ? new SqlParameter("@json_data",json_data) :  new SqlParameter("@json_data",DBNull.Value)
                };
                str = SQLHelper.ExecuteReaderReturnJSON("qfk_products_sources_search", parameters).ToString();
            }
            catch { throw; }
            return str;
        }
        public static DataTable SourceList(long company_id, string search, int pageno, int pagesize, string sortcol = "created_on", string sortdir = "desc", string flag = "lists")
        {
            DataTable dt;
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag",flag),
                    new SqlParameter("@company_id", company_id),
                    !string.IsNullOrEmpty(search) ? new SqlParameter("@search", search) : new SqlParameter("@search", DBNull.Value),
                    new SqlParameter("@pageno", pageno),
                    new SqlParameter("@pagesize", pagesize),
                    new SqlParameter("@sortcol", sortcol),
                    new SqlParameter("@sortdir", sortdir)
                };
                dt = SQLHelper.ExecuteDataTable("qfk_products_sources_search", parameters);
            }
            catch { throw; }
            return dt;
        }
        public static DataTable ProductList(long company_id, long id, string json_where, string search, int pageno, int pagesize, string sortcol = "created_on", string sortdir = "desc", string flag = "lists")
        {
            DataTable dt;
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag",flag),
                    new SqlParameter("@company_id", company_id),
                    id > 0 ? new SqlParameter("@id", id) : new SqlParameter("@id", DBNull.Value),
                    !string.IsNullOrEmpty(search) ? new SqlParameter("@search", search) : new SqlParameter("@search", DBNull.Value),
                    !string.IsNullOrEmpty(json_where) ? new SqlParameter("@json_data", json_where) : new SqlParameter("@json_data", DBNull.Value),
                    new SqlParameter("@pageno", pageno),
                    new SqlParameter("@pagesize", pagesize),
                    new SqlParameter("@sortcol", sortcol),
                    new SqlParameter("@sortdir", sortdir)
                };
                dt = SQLHelper.ExecuteDataTable("qfk_products_sources_search", parameters);
            }
            catch { throw; }
            return dt;
        }
        public static string ProductDetail(long company_id, long id)
        {
            string json_data;
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag","productdetail"),
                    new SqlParameter("@company_id", company_id),
                    id > 0 ? new SqlParameter("@id", id) : new SqlParameter("@id", DBNull.Value),
                };
                json_data = SQLHelper.ExecuteReaderReturnJSON("qfk_products_sources_search", parameters).ToString();
            }
            catch { throw; }
            return json_data;
        }
        public static DataTable Products(long company_id)
        {
            DataTable dt;
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag","products"),
                    new SqlParameter("@company_id", company_id),
                };
                dt = SQLHelper.ExecuteDataTable("qfk_products_sources_search", parameters);
            }
            catch { throw; }
            return dt;
        }
    }
}