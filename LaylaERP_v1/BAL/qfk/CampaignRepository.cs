namespace LaylaERP.BAL.qfk
{
    using DAL;
    using System;
    using System.Data;
    using System.Collections.Generic;
    using System.Data.SqlClient;
    using System.Linq;
    using System.Web;

    public class CampaignRepository
    {
        public static string CampaignsAdd(string flag, long user_id, long company_id, long campaign_id, string json_data)
        {
            string str = "{}";
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag", flag),
                    company_id > 0 ? new SqlParameter("@company_id",company_id) : new SqlParameter("@company_id",DBNull.Value),
                    campaign_id > 0 ? new SqlParameter("@campaign_id",campaign_id) : new SqlParameter("@campaign_id",DBNull.Value),
                    user_id > 0 ? new SqlParameter("@user_id",user_id) : new SqlParameter("@user_id", DBNull.Value),
                    !string.IsNullOrEmpty(json_data) ? new SqlParameter("@json_data",json_data) :  new SqlParameter("@json_data",DBNull.Value)
                };
                str = SQLHelper.ExecuteReaderReturnJSON("qfk_campaigns_mails_search", parameters).ToString();
            }
            catch { throw; }
            return str;
        }
        public static DataTable CampaignsList(long company_id, string search, int pageno, int pagesize, string sortcol = "created_on", string sortdir = "desc", string flag = "lists")
        {
            DataTable dt;
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag",flag),
                    new SqlParameter("@company_id", company_id),
                    !string.IsNullOrEmpty(search) ? new SqlParameter("@search", search) : new SqlParameter("@search", DBNull.Value),
                    new SqlParameter("@pageno", pageno),
                    new SqlParameter("@pagesize", pagesize),
                    new SqlParameter("@sortcol", sortcol),
                    new SqlParameter("@sortdir", sortdir)
                };
                dt = SQLHelper.ExecuteDataTable("qfk_campaigns_mails_search", parameters);
            }
            catch { throw; }
            return dt;
        }

        public static string CampaignProfiles(long campaign_id)
        {
            string str = "{}";
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag", "profiles"),
                    new SqlParameter("@campaign_id",campaign_id)
                };
                str = SQLHelper.ExecuteReaderReturnJSON("qfk_campaigns_mails_scheduled", parameters).ToString();
            }
            catch { throw; }
            return str;
        }

        public static DataTable GetCampaignsRecipients(long company_id, long campaign_id, string mail_status, string search, int pageno, int pagesize, string sortcol = "created_on", string sortdir = "desc", string flag = "lists")
        {
            DataTable dt;
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag",flag),
                    new SqlParameter("@company_id", company_id),
                    new SqlParameter("@campaign_id", campaign_id),
                    !string.IsNullOrEmpty(mail_status) ? new SqlParameter("@event", mail_status) : new SqlParameter("@event", DBNull.Value),
                    !string.IsNullOrEmpty(search) ? new SqlParameter("@search", search) : new SqlParameter("@search", DBNull.Value),
                    new SqlParameter("@pageno", pageno),
                    new SqlParameter("@pagesize", pagesize),
                    new SqlParameter("@sortcol", sortcol),
                    new SqlParameter("@sortdir", sortdir)
                };
                dt = SQLHelper.ExecuteDataTable("qfk_campaigns_mails_search", parameters);
            }
            catch { throw; }
            return dt;
        }
    }
}