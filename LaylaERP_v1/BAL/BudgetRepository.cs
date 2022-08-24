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
        public static DataTable GetAccountBudget(int fiscalyear_id, string interval, DateTime? fromdate, DateTime? todate)
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
                    {
                        new SqlParameter("@flag", "ALLPLACC"),
                        fiscalyear_id > 0 ? new SqlParameter("@fiscalyear_id", fiscalyear_id) : new SqlParameter("@fiscalyear_id", DBNull.Value),
                        !string.IsNullOrEmpty (interval) ? new SqlParameter("@interval", interval) : new SqlParameter("@interval", interval),
                        fromdate.HasValue ? new SqlParameter("@fromdate", fromdate.Value) : new SqlParameter("@fromdate", DBNull.Value),
                        todate.HasValue ? new SqlParameter("@todate", todate.Value) : new SqlParameter("@todate", DBNull.Value)
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