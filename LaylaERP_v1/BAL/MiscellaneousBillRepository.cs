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
    }
}