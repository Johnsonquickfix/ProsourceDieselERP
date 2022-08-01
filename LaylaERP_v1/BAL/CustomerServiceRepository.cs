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

        public static DataSet GetQuestionsMaster()
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] parameters = { new SqlParameter("@flag", "HELPDESKTYPE") };
                ds = SQLHelper.ExecuteDataSet("erp_helpdesk_search", parameters);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }
        public static DataTable GetHelpdeskQuestions(string flag, int wr_typeid)
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] parameters = { new SqlParameter("@flag", flag), new SqlParameter("@id", wr_typeid) };
                dt = SQLHelper.ExecuteDataTable("erp_helpdesk_search", parameters);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static int AddQuestions(int wr_titleid, int wr_typeid, string titlename, int parent_id, string flag)
        {
            int result = 0;
            try
            {
                if (wr_titleid > 0)
                {
                    string strsql = "update erp_helpdesk_title set wr_typeid=@wr_typeid, titlename=@titlename, parent_id=@parent_id, sub_title=@titlename, flag=@flag where wr_titleid = @wr_titleid";

                    SqlParameter[] para =
                    {
                        wr_titleid > 0 ? new SqlParameter("@wr_titleid",wr_titleid) : new SqlParameter("@parent_id",DBNull.Value),
                        new SqlParameter("@wr_typeid", wr_typeid),
                        new SqlParameter("@titlename", titlename),
                        parent_id > 0 ? new SqlParameter("@parent_id",parent_id) : new SqlParameter("@parent_id",DBNull.Value),
                        new SqlParameter("@flag", flag),
                    };
                    if (SQLHelper.ExecuteNonQuery(strsql, para) > 0) result = wr_titleid;
                }
                else
                {
                    string strsql = "INSERT into erp_helpdesk_title(wr_typeid,titlename,parent_id,sub_title,flag) values(@wr_typeid,@titlename,@parent_id, @titlename, @flag); SELECT SCOPE_IDENTITY();";

                    SqlParameter[] para =
                    {
                        //wr_titleid > 0 ? new SqlParameter("@wr_titleid",wr_titleid) : new SqlParameter("@parent_id",DBNull.Value),
                        new SqlParameter("@wr_typeid", wr_typeid),
                        new SqlParameter("@titlename", titlename),
                        parent_id > 0 ? new SqlParameter("@parent_id",parent_id) : new SqlParameter("@parent_id",DBNull.Value),
                        new SqlParameter("@flag", flag),
                    };
                    result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                }
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public static int DeleteQuestions(int wr_titleid)
        {
            int result = 0;
            try
            {
                string strsql = "delete from erp_helpdesk_title where wr_titleid = @wr_titleid";

                SqlParameter[] para =
                {
                        wr_titleid > 0 ? new SqlParameter("@wr_titleid",wr_titleid) : new SqlParameter("@parent_id",DBNull.Value),
                    };
                if (SQLHelper.ExecuteNonQuery(strsql, para) > 0) result = wr_titleid;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
            return result;
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

        public static DataSet GetOrderInfo(long OrderID, long TicketID, string flag = "ORDINFO")
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@order_id", OrderID),
                    new SqlParameter("@ticket_id", TicketID),
                    new SqlParameter("@flag", flag)
                };
                ds = SQLHelper.ExecuteDataSet("erp_order_customer_search", parameters);
                if (ds.Tables.Count > 0) ds.Tables[0].TableName = "order";
                if (ds.Tables.Count > 1) ds.Tables[1].TableName = "order_detail";
                if (ds.Tables.Count > 2) ds.Tables[2].TableName = "order_notes";
                if (ds.Tables.Count > 3) ds.Tables[3].TableName = "order_tickets";
            }
            catch (Exception ex)
            { throw ex; }
            return ds;
        }
        public static DataTable GenerateOrderTicket(string json_data, long user_id, string flag)
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@search", json_data),
                    new SqlParameter("@userid", user_id),
                    new SqlParameter("@flag", flag)
                };
                dt = SQLHelper.ExecuteDataTable("erp_order_customer_search", parameters);
            }
            catch (Exception ex)
            { throw ex; }
            return dt;
        }

        public static DataTable CustomerTickets(long ticket_id, long customer_id, long order_id, string billing_email, string phone_no, string search, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@ticket_id", ticket_id),
                    new SqlParameter("@customer_id", customer_id),
                    new SqlParameter("@order_id", order_id),
                    new SqlParameter("@billing_email", billing_email),
                    new SqlParameter("@phone_no", phone_no),
                    new SqlParameter("@search", search),
                    new SqlParameter("@pageno", pageno),
                    new SqlParameter("@pagesize", pagesize),
                    new SqlParameter("@sortcol", SortCol),
                    new SqlParameter("@sortdir", SortDir),
                    new SqlParameter("@flag", "TICKETLIST")
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

        public static DataTable CustomerTicketInfo(long ticket_id, long order_id = 0, string flag = "TICKETINFO")
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@ticket_id", ticket_id),
                    new SqlParameter("@order_id", order_id),
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

        public static DataTable UpdateTicketFiles(long ticket_id, string fileurl, string flag = "TICKETINFO")
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@ticket_id", ticket_id),
                    new SqlParameter("@filename", fileurl),
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
    }
}