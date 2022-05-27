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
        public static DataTable CustomerOrders(long customer_id, long order_id, string billing_email, string phone_no, string search, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
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
                    new SqlParameter("@phone_no", phone_no),
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

        public static DataTable GetCustomerInfo(long customer_id, long order_id, string billing_email, string phone_no)
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
                {
                    customer_id > 0 ? new SqlParameter("@customer_id", customer_id) : new SqlParameter("@customer_id",DBNull.Value),
                    !string.IsNullOrEmpty(billing_email) ? new SqlParameter("@billing_email", billing_email) : new SqlParameter("@billing_email",DBNull.Value),
                    !string.IsNullOrEmpty(phone_no) ? new SqlParameter("@phone_no", phone_no) : new SqlParameter("@phone_no",DBNull.Value),
                    order_id > 0 ? new SqlParameter("@order_id", order_id) : new SqlParameter("@order_id",DBNull.Value),
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

        public static DataSet GetOrderInfo(long OrderID)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@order_id", OrderID),
                    new SqlParameter("@flag", "ORDINFO")
                };
                ds = SQLHelper.ExecuteDataSet("erp_order_customer_search", parameters);
                if (ds.Tables.Count > 0) ds.Tables[0].TableName = "order";
                if (ds.Tables.Count > 1) ds.Tables[1].TableName = "order_detail";
            }
            catch (Exception ex)
            { throw ex; }
            return ds;
        }
        public static DataTable GenerateOrderTicket(string json_data)
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@search", json_data),
                    new SqlParameter("@flag", "GENTOKEN")
                };
                dt = SQLHelper.ExecuteDataTable("erp_order_customer_search", parameters);
            }
            catch (Exception ex)
            { throw ex; }
            return dt;
        }
    }
}