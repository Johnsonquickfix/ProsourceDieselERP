namespace LaylaERP.BAL.qfk
{
    using LaylaERP.DAL;
    using System;
    using System.Data;
    using System.Data.SqlClient;

    public class ProfilesRepository
    {
        #region [Lists & Segments]
        public static DataTable GroupList(long company_id, string search, int pageno, int pagesize, string sortcol = "created_on", string sortdir = "desc", string flag = "lists")
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
                dt = SQLHelper.ExecuteDataTable("qfk_groups_search", parameters);
            }
            catch { throw; }
            return dt;
        }
        public static string GroupAdd(string flag, string api_key, long user_id, string json_data)
        {
            string str = "{}";
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag", flag),
                    new SqlParameter("@api_key",api_key),
                    new SqlParameter("@user_id",user_id),
                    new SqlParameter("@json_data",json_data)
                };
                str = SQLHelper.ExecuteReaderReturnJSON("qfk_groups_search", parameters).ToString();
            }
            catch { throw; }
            return str;
        }
        public static int GroupMemberCount(long id)
        {
            int i = 0;
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag", "membercount"),
                    new SqlParameter("@id",id)
                };
                i = Convert.ToInt32(SQLHelper.ExecuteScalar("qfk_groups_members_search", parameters).ToString());
            }
            catch { throw; }
            return i;
        }
        public static DataTable GroupMemberCount(string ids)
        {
            DataTable dt;
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag", "groupwithcount"),
                    new SqlParameter("@id",ids)
                };
                dt = SQLHelper.ExecuteDataTable("qfk_groups_members_search", parameters);
            }
            catch { throw; }
            return dt;
        }
        public static DataTable GroupMembers(long company_id, long group_id, string search, int pageno, int pagesize, string sortcol = "created", string sortdir = "desc")
        {
            DataTable dt;
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag","listmembers"),
                    new SqlParameter("@company_id", company_id),
                    new SqlParameter("@id", group_id),
                    !string.IsNullOrEmpty(search) ? new SqlParameter("@search", search) : new SqlParameter("@search", DBNull.Value),
                    new SqlParameter("@pageno", pageno),
                    new SqlParameter("@pagesize", pagesize),
                    new SqlParameter("@sortcol", sortcol),
                    new SqlParameter("@sortdir", sortdir)
                };
                dt = SQLHelper.ExecuteDataTable("qfk_groups_members_search", parameters);
            }
            catch { throw; }
            return dt;
        }
        public static int ConvertTolist(long company_id, long group_id, long user_id)
        {
            int i = 0;
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag","converttolist"),
                    new SqlParameter("@company_id", company_id),
                    new SqlParameter("@id", group_id),
                    new SqlParameter("@user_id",user_id),
                };
                i = SQLHelper.ExecuteNonQuery("qfk_groups_members_search", parameters);
            }
            catch { throw; }
            return i;
        }
        public static DataTable GroupList(long company_id, int group_type_id, string flag = "static-group")
        {
            DataTable dt;
            try
            {
                SqlParameter[] parameters = { new SqlParameter("@flag", flag), new SqlParameter("@company_id", company_id), new SqlParameter("@id", group_type_id), };
                dt = SQLHelper.ExecuteDataTable("qfk_groups_search", parameters);
            }
            catch { throw; }
            return dt;
        }
        public static DataTable GetCountries()
        {
            DataTable dt;
            try
            {
                SqlParameter[] parameters = { };
                dt = SQLHelper.ExecuteDataTable("select code,name from qfk_countries order by name", parameters);
            }
            catch { throw; }
            return dt;
        }
        #endregion

        #region [Profiles data]
        /// <summary>
        /// Profiles List
        /// </summary>
        /// <param name="company_id"></param>
        /// <param name="search"></param>
        /// <param name="pageno"></param>
        /// <param name="pagesize"></param>
        /// <param name="sortcol"></param>
        /// <param name="sortdir"></param>
        /// <param name="flag"></param>
        /// <returns></returns>
        public static DataTable ProfilesList(long company_id, string search, int pageno, int pagesize, string sortcol = "created_on", string sortdir = "desc", string flag = "profiles")
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
                dt = SQLHelper.ExecuteDataTable("qfk_profiles_search", parameters);
            }
            catch { throw; }
            return dt;
        }
        public static string ProfileCreate(string flag, string api_key, long company_id = 0, string id = "", string json_data = "")
        {
            string _json = string.Empty;
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag",flag),
                    new SqlParameter("@api_key",api_key),
                    new SqlParameter("@company_id", company_id),
                    !string.IsNullOrEmpty(id) ? new SqlParameter("@id", id) : new SqlParameter("@id", DBNull.Value),
                    !string.IsNullOrEmpty(json_data) ? new SqlParameter("@json_data", json_data) : new SqlParameter("@json_data",DBNull.Value)
                };
                _json = SQLHelper.ExecuteReaderReturnJSON("qfk_profiles_search", parameters).ToString();
            }
            catch { throw; }
            return _json;
        }
        public static string ProfileDetails(string flag = "profiledetail", long company_id = 0, string id = "")
        {
            string json_data = string.Empty;
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag",flag),
                    new SqlParameter("@company_id", company_id),
                    new SqlParameter("@id", id),
                };
                json_data = SQLHelper.ExecuteReaderReturnJSON("qfk_profiles_search", parameters).ToString();
            }
            catch { throw; }
            return json_data;
        }
        public static string ProfileActivityFeed(string flag, long company_id, long metric_id, string profiles_id, int pageno = 0, int pagesize = 10)
        {
            string json_data = string.Empty;
            try
            {
                SqlParameter[] parameters =
                {
                    //new SqlParameter("@flag","profiledetail"),
                    new SqlParameter("@flag",flag),
                    new SqlParameter("@company_id", company_id),
                    metric_id > 0 ? new SqlParameter("@metric_id", metric_id) : new SqlParameter("@metric_id", DBNull.Value),
                    new SqlParameter("@id", profiles_id),
                    new SqlParameter("@pageno", pageno),
                    new SqlParameter("@pagesize", pagesize)
                };
                json_data = SQLHelper.ExecuteReaderReturnJSON("qfk_profiles_search", parameters).ToString();
            }
            catch { throw; }
            return json_data;
        }
        #endregion

        #region [Metrics data]
        public static DataTable MetricsList(long company_id, string search, int pageno, int pagesize, string sortcol = "created", string sortdir = "desc")
        {
            DataTable dt;
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag","metrics"),
                    new SqlParameter("@company_id", company_id),
                    !string.IsNullOrEmpty(search) ? new SqlParameter("@search", search) : new SqlParameter("@search", DBNull.Value),
                    new SqlParameter("@pageno", pageno),
                    new SqlParameter("@pagesize", pagesize),
                    new SqlParameter("@sortcol", sortcol),
                    new SqlParameter("@sortdir", sortdir)
                };
                dt = SQLHelper.ExecuteDataTable("qfk_metrics_search", parameters);
            }
            catch { throw; }
            return dt;
        }
        public static string MetricsFeedsList(long company_id, long metric_id, DateTime? date_from, DateTime? date_to, string search, int pageno, int pagesize, string sortcol = "created", string sortdir = "desc", string flag = "feeds")
        {
            string json_data = string.Empty;
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag",flag),
                    new SqlParameter("@company_id", company_id),
                    new SqlParameter("@metric_id", metric_id),
                    date_from.HasValue ? new SqlParameter("@date_from", date_from.Value) : new SqlParameter("@date_from", DBNull.Value),
                    date_to.HasValue ? new SqlParameter("@date_to", date_to.Value) : new SqlParameter("@date_to", DBNull.Value),
                    !string.IsNullOrEmpty(search) ? new SqlParameter("@search", search) : new SqlParameter("@search", DBNull.Value),
                    new SqlParameter("@pageno", pageno),
                    new SqlParameter("@pagesize", pagesize),
                    new SqlParameter("@sortcol", sortcol),
                    new SqlParameter("@sortdir", sortdir)
                };
                json_data = SQLHelper.ExecuteReaderReturnJSON("qfk_metrics_search", parameters).ToString();
            }
            catch { throw; }
            return !string.IsNullOrEmpty(json_data) ? json_data : "[]";
        }
        public static DataTable MetricsChart(long company_id, long metric_id, string period, DateTime date_from, DateTime date_to)
        {
            DataTable dt;
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag","chart"),
                    new SqlParameter("@company_id", company_id),
                    new SqlParameter("@metric_id", metric_id),
                    !string.IsNullOrEmpty(period) ? new SqlParameter("@period", period) : new SqlParameter("@period", "daily"),
                    new SqlParameter("@date_from", date_from),
                    new SqlParameter("@date_to", date_to)
                };
                dt = SQLHelper.ExecuteDataTable("qfk_metrics_search", parameters);
            }
            catch { throw; }
            return dt;
        }
        #endregion
    }
}