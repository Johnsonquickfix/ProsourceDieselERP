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
        public static DataTable UpdatePodiumDetails(string flag, long id, long user_id, string order_quote)
        {
            var dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag", flag),
                    new SqlParameter("@user_id", user_id),
                    new SqlParameter("@id", id),
                    new SqlParameter("@quote_json", order_quote),
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
        public static DataTable QuoteApproval(long id, string quotestatus, string row_key)
        {
            var dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@id", id),
                    new SqlParameter("@search", row_key),
                    new SqlParameter("@quote_status", quotestatus),
                    new SqlParameter("@flag", "QUOTMA"),
                };
                dt = SQLHelper.ExecuteDataTable("erp_order_quote_search", parameters);
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
            return dt;
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
        public static long CreateOrder(long quote_no, string host)
        {
            long id = 0;
            try
            {
                DateTime cDate = CommonDate.CurrentDate(), cUTFDate = CommonDate.UtcDate();
                string strSql = "INSERT INTO wp_posts(post_author, post_date, post_date_gmt, post_content, post_title, post_excerpt,post_status, comment_status, ping_status, post_password, post_name,to_ping, pinged, post_modified, post_modified_gmt,post_content_filtered, post_parent, guid, menu_order,post_type, post_mime_type, comment_count)"
                                + "select '1','" + cDate.ToString("yyyy-MM-dd HH:mm:ss") + "','" + cUTFDate.ToString("yyyy-MM-dd HH:mm:ss") + "','','Order &ndash; " + cUTFDate.ToString("MMMM dd, yyyy @ HH:mm tt") + "','','auto-draft',"
                                + "'open','closed','','order-" + CommonDate.UtcDate().ToString("MMM-dd-yyyy-HHmm-tt") + "','','','" + cDate.ToString("yyyy-MM-dd HH:mm:ss") + "','" + cUTFDate.ToString("yyyy-MM-dd HH:mm:ss") + "',"
                                + "'','0','" + host + "/~rpsisr/woo/post_type=shop_order&p=','0','shop_order','shop_order_erp','0' ; ";

                strSql += "insert into wp_wc_order_stats (order_id,parent_id,date_created,date_created_gmt,num_items_sold,total_sales,tax_total,shipping_total,net_total,returning_customer,status,customer_id)";
                strSql += "SELECT LAST_INSERT_ID(),'0','" + cDate.ToString("yyyy-MM-dd HH:mm:ss") + "','" + cUTFDate.ToString("yyyy-MM-dd HH:mm:ss") + "','0','0','0','0','0','0','auto-draft','0' ; SELECT LAST_INSERT_ID();";

                id = Convert.ToInt64(DAL.MYSQLHelper.ExecuteScalar(strSql));
                if (id > 0)
                {
                    strSql = string.Format("update erp_order_quote set order_id = {0},order_id = 'auto-draft',modified_date = '{1}',modified_date_gmt = '{2}' where quote_no = {3};", id, cDate.ToString("yyyy-MM-dd HH:mm:ss"), cUTFDate.ToString("yyyy-MM-dd HH:mm:ss"), quote_no);
                    strSql += string.Format("insert into erp_order_quote_action (quote_no,action_date,quote_status,remark) select quote_no,'{0}',quote_status,'Create Order #{1}' from erp_order_quote where quote_no = {1};", cDate.ToString("yyyy-MM-dd HH:mm:ss"), id, quote_no);

                    var result = DAL.SQLHelper.ExecuteNonQuery(strSql);
                }
            }
            catch (MySql.Data.MySqlClient.MySqlException ex)
            {
                throw new Exception(ex.Message);
            }
            return id;
        }
    }
}