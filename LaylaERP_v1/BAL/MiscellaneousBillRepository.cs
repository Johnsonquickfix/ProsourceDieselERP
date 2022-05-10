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
    using System.Xml;

    public class MiscellaneousBillRepository
    {
        public static DataTable AutoBillConfigSave(long id, long userid, string flag, XmlDocument headerXML, XmlDocument detailsXML)
        {
            var dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@id", id),
                    new SqlParameter("@userid", userid),
                    new SqlParameter("@qflag", flag),
                    new SqlParameter("@headerXML", headerXML.OuterXml),
                    new SqlParameter("@detailsXML", detailsXML.OuterXml)
                };
                dt = SQLHelper.ExecuteDataTable("erp_misc_autobill_search", parameters);
            }
            catch (Exception ex)
            {
                UserActivityLog.ExpectionErrorLog(ex, "MiscellaneousBillRepository/NewMiscBill/" + id + "", "Auto Bill Configuration");
                throw new Exception(ex.Message);
            }
            return dt;
        }

        public static DataTable AutoBillsList(DateTime? fromdate, DateTime? todate,  string search, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                SqlParameter[] parameters =
                {
                    fromdate.HasValue ? new SqlParameter("@fromdate", fromdate.Value) : new SqlParameter("@fromdate", DBNull.Value),
                    todate.HasValue ? new SqlParameter("@todate", todate.Value) : new SqlParameter("@todate", DBNull.Value),
                    new SqlParameter("@search", search),
                    new SqlParameter("@pageno", pageno),
                    new SqlParameter("@pagesize", pagesize),
                    new SqlParameter("@sortcol", SortCol),
                    new SqlParameter("@sortdir", SortDir),
                    new SqlParameter("@qflag", "SERCH"),
                };
                DataSet ds = SQLHelper.ExecuteDataSet("erp_misc_autobill_search", parameters);
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