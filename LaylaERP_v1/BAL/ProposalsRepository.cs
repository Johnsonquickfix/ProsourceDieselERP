namespace LaylaERP.BAL
{
    using DAL;
    using Models;
    using UTILITIES;
    using System.Data.SqlClient;
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Linq;
    using System.Web;
    using System.Xml;

    public class ProposalsRepository
    {
        public static DataTable GetProposals(DateTime? fromdate, DateTime? todate, long supplierid, string search, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                SqlParameter[] parameters =
                {
                    fromdate.HasValue ? new SqlParameter("@fromdate", fromdate.Value) : new SqlParameter("@fromdate", DBNull.Value),
                    todate.HasValue ? new SqlParameter("@todate", todate.Value) : new SqlParameter("@todate", DBNull.Value),
                    new SqlParameter("@flag", "SERCH"),
                    //!CommanUtilities.Provider.GetCurrent().UserType.ToLower().Contains("administrator") ? new SqlParameter("@userid", CommanUtilities.Provider.GetCurrent().UserID) : new SqlParameter("@userid",DBNull.Value),
                    new SqlParameter("@supplierid", supplierid),
                    new SqlParameter("@searchcriteria", search),
                    new SqlParameter("@pageno", pageno),
                    new SqlParameter("@pagesize", pagesize),
                    new SqlParameter("@sortcol", SortCol),
                    new SqlParameter("@sortdir", SortDir)
                };
                DataSet ds = SQLHelper.ExecuteDataSet("erp_Proposals_search", parameters);
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