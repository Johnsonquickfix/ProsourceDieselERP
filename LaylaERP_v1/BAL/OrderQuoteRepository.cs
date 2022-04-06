namespace LaylaERP.BAL
{
    using LaylaERP.DAL;
    using LaylaERP.UTILITIES;
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Data.SqlClient;
    using System.Linq;
    using System.Web;

    public class OrderQuoteRepository
    {
        public static DataTable AddOrdersQuote(long id, long user_id, string order_quote, string order_quote_details)
        {
            var dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag", "ADD"),
                    new SqlParameter("@user_id", user_id),
                    new SqlParameter("@id", id),
                    new SqlParameter("@quote_json", order_quote),
                    new SqlParameter("@quote_details_json", order_quote_details)
                };
                dt = SQLHelper.ExecuteDataTable("erp_order_quote_search", parameters);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return dt;
        }
        public static DataSet GetOrdersQuote(long id)
        {
            var ds = new DataSet();
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag", "GETBID"),
                    new SqlParameter("@id", id),
                };
                ds = SQLHelper.ExecuteDataSet("erp_order_quote_search", parameters);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return ds;
        }
        public static DataTable QuoteCounts(DateTime? fromdate, DateTime? todate, long UserID)
        {
            DataTable dt = new DataTable();
            try
            {
                string strWhr = string.Empty;
                if (CommanUtilities.Provider.GetCurrent().UserType.ToLower().Contains("administrator"))
                {
                    UserID = 0;
                }
                SqlParameter[] parameters =
                {
                    fromdate.HasValue ? new SqlParameter("@fromdate", fromdate.Value) : new SqlParameter("@fromdate", DBNull.Value),
                    todate.HasValue ? new SqlParameter("@todate", todate.Value) : new SqlParameter("@todate", DBNull.Value),
                    UserID > 0 ? new SqlParameter("@user_id", UserID) : new SqlParameter("@user_id", DBNull.Value),
                    new SqlParameter("@flag", "QUOTEC")
                };
                dt = SQLHelper.ExecuteDataTable("erp_order_quote_search", parameters);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static DataTable QuoteList(DateTime? fromdate, DateTime? todate, long customerid, string quote_status, string search, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                SqlParameter[] parameters =
                {
                    fromdate.HasValue ? new SqlParameter("@fromdate", fromdate.Value) : new SqlParameter("@fromdate", DBNull.Value),
                    todate.HasValue ? new SqlParameter("@todate", todate.Value) : new SqlParameter("@todate", DBNull.Value),
                    customerid > 0 ? new SqlParameter("@customer_id", customerid) : new SqlParameter("@customer_id", DBNull.Value),
                    new SqlParameter("@quote_status", quote_status),
                    new SqlParameter("@search", search),
                    new SqlParameter("@pageno", pageno),
                    new SqlParameter("@pagesize", pagesize),
                    new SqlParameter("@sortcol", SortCol),
                    new SqlParameter("@sortdir", SortDir),
                    new SqlParameter("@flag", "OQTLS")
                };

                DataSet ds = SQLHelper.ExecuteDataSet("erp_order_quote_search", parameters);
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