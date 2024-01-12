namespace LaylaERP.BAL.qfk
{
    using DAL;
    using System;
    using System.Data;
    using System.Data.SqlClient;

    public class TrackAndIdentifyRepository
    {
        public static int ProfileUpdate(string flag, long user_id, string json_data)
        {
            int i = 0;
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag", flag),
                    new SqlParameter("@user_id",user_id),
                    new SqlParameter("@json_data",json_data)
                };
                DataTable dt = SQLHelper.ExecuteDataTable("qfk_profiles_import", parameters);
                if (dt.Rows.Count > 0)
                {
                    i = (dt.Rows[0]["status"] != Convert.DBNull) ? Convert.ToInt32(dt.Rows[0]["status"]) : 0;
                }
            }
            catch { i = 0; }
            return i;
        }

        public static string ProfileListSubscribe(string flag, string api_key, long group_id, string json_data)
        {
            string str = "{}";
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag", flag),
                    new SqlParameter("@public_api_key", api_key),
                    group_id > 0 ? new SqlParameter("@group_id",group_id) : new SqlParameter("@user_id",DBNull.Value),
                    new SqlParameter("@json_data",json_data)
                };
                str = SQLHelper.ExecuteReaderReturnJSON("qfk_profiles_import", parameters).ToString();
            }
            catch { throw; }
            return str;
        }

        public static int EmailTrackingUpdate(string flag, long company_id, long campaign_id, string profiles_id, string track_event, long user_id)
        {
            int i = 0;
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag", flag),
                    new SqlParameter("@company_id",company_id),
                    new SqlParameter("@campaign_id",campaign_id),
                    new SqlParameter("@profiles_id",profiles_id),
                    new SqlParameter("@event",track_event),
                    new SqlParameter("@user_id",user_id)
                };
                DataTable dt = SQLHelper.ExecuteDataTable("qfk_campaigns_mails_search", parameters);
                if (dt.Rows.Count > 0)
                {
                    i = (dt.Rows[0]["status"] != Convert.DBNull) ? Convert.ToInt32(dt.Rows[0]["status"]) : 0;
                }
            }
            catch { i = 0; }
            return i;
        }

        public static int CampaignTracking(string flag, string track_id, string json_data = "")
        {
            int i = 0;
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag", flag),
                    new SqlParameter("@id",track_id),
                    !string.IsNullOrEmpty(json_data) ? new SqlParameter("@json_data",json_data) : new SqlParameter("@json_data",DBNull.Value)
                };
                DataTable dt = SQLHelper.ExecuteDataTable("qfk_campaigns_mails_scheduled", parameters);
                if (dt.Rows.Count > 0)
                {
                    i = (dt.Rows[0]["status"] != Convert.DBNull) ? Convert.ToInt32(dt.Rows[0]["status"]) : 0;
                }
            }
            catch { i = 0; }
            return i;
        }
    }
}