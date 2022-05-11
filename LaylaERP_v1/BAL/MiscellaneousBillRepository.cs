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
        public static DataSet GetAutoBillByID(long id)
        {
            var ds = new DataSet();
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@id", id),
                    new SqlParameter("@qflag", "GETID"),
                };
                ds = SQLHelper.ExecuteDataSet("erp_misc_autobill_search", parameters);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }

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
                UserActivityLog.ExpectionErrorLog(ex, "MiscellaneousBillRepository/AutoBillConfigSave/" + id + "", "Auto Bill Configuration");
                throw new Exception(ex.Message);
            }
            return dt;
        }

        public static int BillStatusUpdate(long id, long userid, bool is_active)
        {
            int i = 0;
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@id", id),
                    new SqlParameter("@userid", userid),
                    new SqlParameter("@is_active", is_active)
                };
                i = SQLHelper.ExecuteNonQuery("update erp_commerce_miscellaneous_autobill set fk_user_modif = @userid,date_modified = getdate(),is_active = @is_active where rowid = @id;", parameters);
            }
            catch (Exception ex)
            {
                UserActivityLog.ExpectionErrorLog(ex, "MiscellaneousBillRepository/BillStatusUpdate/" + id + "", "Auto Bill Configuration");
                throw ex;
            }
            return i;
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