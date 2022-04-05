namespace LaylaERP.BAL
{
    using LaylaERP.DAL;
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
    }
}