namespace LaylaERP.BAL
{
    using LaylaERP.DAL;
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Data.SqlClient;
    using System.Linq;
    using System.Web;

    public class CustomerServiceRepository
    {
        public static DataTable CustomerOrders(long customer_id, long order_id, string billing_email, string search, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@customer_id", customer_id),
                    new SqlParameter("@order_id", order_id),
                    new SqlParameter("@billing_email", billing_email),
                    new SqlParameter("@search", search),
                    new SqlParameter("@pageno", pageno),
                    new SqlParameter("@pagesize", pagesize),
                    new SqlParameter("@sortcol", SortCol),
                    new SqlParameter("@sortdir", SortDir),
                    new SqlParameter("@flag", "ORDLS")
                };

                DataSet ds = SQLHelper.ExecuteDataSet("erp_order_customer_search", parameters);
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

        public static DataTable GetCustomers(string flag, string search)
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@search", search),
                    new SqlParameter("@flag", flag)
                };

                dt = SQLHelper.ExecuteDataTable("erp_order_customer_search", parameters);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataTable GetCustomerInfo(long customer_id, long order_id, string billing_email)
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@customer_id", customer_id),
                    new SqlParameter("@billing_email", billing_email),
                    new SqlParameter("@order_id", order_id),
                    new SqlParameter("@flag", "CUSTINFO")
                };

                dt = SQLHelper.ExecuteDataTable("erp_order_customer_search", parameters);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
    }
}