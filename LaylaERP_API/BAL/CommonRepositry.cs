namespace LaylaERP_API.BAL
{
    using DAL;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;
    using System.Data;
    using System.Data.SqlClient;

    public class CommonRepositry
    {
        public static DataTable GetOrders(long user_id, int pageno)
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
                 {
                    new SqlParameter("@flag", "ORDLS"),
                    new SqlParameter("@customer_id", user_id),
                    new SqlParameter("@pageno", pageno)

                };
                dt = SQLHelper.ExecuteDataTable("api_user_details", parameters);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
    }
}