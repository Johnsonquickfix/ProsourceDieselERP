namespace LaylaERP.BAL
{
    using LaylaERP.DAL;
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Data.SqlClient;
    using System.Linq;
    using System.Web;

    public class BudgetRepository
    {
        public static DataSet GetFiscalYear()
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] parameters =
                    {
                        new SqlParameter("@flag", "FISCALYEAR")
                    };
                ds = SQLHelper.ExecuteDataSet("erp_budget_search", parameters);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }
        public static DataTable GetBudgets(string search, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@search", search),
                    new SqlParameter("@pageno", pageno),
                    new SqlParameter("@pagesize", pagesize),
                    new SqlParameter("@sortcol", SortCol),
                    new SqlParameter("@sortdir", SortDir),
                    new SqlParameter("@flag", "ALLBUDGET")
                };

                dt = SQLHelper.ExecuteDataTable("erp_budget_search", parameters);
                if (dt.Rows.Count > 0) totalrows = Convert.ToInt32(dt.Rows[0]["total_record"].ToString());
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static DataTable GetAccountBudget(int fiscalyear_id, string interval, int data_year)
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
                    {
                        new SqlParameter("@flag", "ALLPLACC"),
                        fiscalyear_id > 0 ? new SqlParameter("@fiscalyear_id", fiscalyear_id) : new SqlParameter("@fiscalyear_id", DBNull.Value),
                        !string.IsNullOrEmpty (interval) ? new SqlParameter("@interval", interval) : new SqlParameter("@interval",  DBNull.Value),
                        data_year > 0 ? new SqlParameter("@year", data_year) : new SqlParameter("@year", DBNull.Value),
                    };
                dt = SQLHelper.ExecuteDataTable("erp_budget_search", parameters);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static DataTable SaveBudget(int budget_id, long user_id, string json_data)
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
                    {
                        new SqlParameter("@flag", "SAVEBUDGET"),
                        budget_id > 0 ? new SqlParameter("@id", budget_id) : new SqlParameter("@id", DBNull.Value),
                        !string.IsNullOrEmpty (json_data) ? new SqlParameter("@json_data", json_data) : new SqlParameter("@json_data", DBNull.Value),
                        user_id > 0 ? new SqlParameter("@user_id", user_id) : new SqlParameter("@user_id", DBNull.Value),
                    };
                dt = SQLHelper.ExecuteDataTable("erp_budget_search", parameters);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
    }
}