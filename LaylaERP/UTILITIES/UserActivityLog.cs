namespace LaylaERP.UTILITIES
{
    using System;
    using System.ComponentModel;
    using System.IO;
    using System.Management;
    using System.Net;
    using System.Net.Sockets;
    using System.Text;
    using System.Web;
    using LaylaERP.DAL;
    using MySql.Data.MySqlClient;

    public enum LogType
    {
        [Description("Other")]
        Other = 0,
        [Description("Log in")]
        Login = 1,
        [Description("Log Out")]
        Exit = 2,
        [Description("Access")]
        Visit = 3,
        [Description("Added")]
        Create = 4,
        [Description("Delete")]
        Delete = 5,
        [Description("Modify")]
        Update = 6,
        [Description("Submit")]
        Submit = 7,
        [Description("Exception")]
        Exception = 8,
    }

    public class UserActivityLog
    {
        public long ID { get; set; }
        public long UserID { get; set; }
        public DateTime? ActivityDate { get; set; }
        public int LogType { get; set; }
        public string IPAddress { get; set; }
        public string MacID { get; set; }
        public string ModuleName { get; set; }
        public string Description { get; set; }

        public static int WriteDbLog(LogType logType, string moduleName, string resultLog)
        {
            int result = 0;

            MySql.Data.MySqlClient.MySqlCommand _cmd = new MySql.Data.MySqlClient.MySqlCommand();
            try
            {
                OperatorModel OM = CommanUtilities.Provider.GetCurrent();
                long userid = CommanUtilities.Provider.GetCurrent().UserID;
                string strSql = "INSERT INTO wp_users_activitylog(user_id,log_date,log_type_id,ip_address,mac_id,module_name,description) VALUES(@user_id,@log_date,@log_type_id,@ip_address,@mac_id,@module_name,@description)";

                MySqlParameter[] parameters =
                {
                    new MySqlParameter("@user_id", OM.UserID),
                    new MySqlParameter("@log_date", DateTime.Now),
                    new MySqlParameter("@log_type_id", Convert.ToInt32(logType)),
                    new MySqlParameter("@ip_address", OM.LoginIPAddress),
                    new MySqlParameter("@mac_id", OM.LoginMacAddress),
                    new MySqlParameter("@module_name", moduleName),
                    new MySqlParameter("@description", resultLog)
                };
                result = SQLHelper.ExecuteNonQuery(strSql, parameters);
            }
            catch { }
            return result;
        }

        public static void LogError(Exception ex, string URL)
        {
            try
            {
                StringBuilder strErrorLog = new StringBuilder();
                strErrorLog.Append("\r\n ==========================================================================================================");
                strErrorLog.Append("\r\n Date Time: " + System.DateTime.Now.ToString());
                strErrorLog.Append("\r\n URL: " + URL);
                strErrorLog.Append("\r\n Host: " + Net.Host);
                strErrorLog.Append("\r\n Error: " + ex.Message);
                strErrorLog.Append("\r\n Source : " + ex.Source);
                strErrorLog.Append("\r\n StackTrace: " + ex.StackTrace);
                String FileName = string.Empty;
                if (HttpContext.Current != null)
                    FileName = HttpContext.Current.Server.MapPath("~//AppLog//Log" + System.DateTime.Now.Year.ToString() + System.DateTime.Now.Month.ToString() + System.DateTime.Now.Day.ToString() + ".txt");
                else
                    FileName = HttpRuntime.AppDomainAppPath.ToString() + ("AppLog//Log" + System.DateTime.Now.Year.ToString() + System.DateTime.Now.Month.ToString() + System.DateTime.Now.Day.ToString() + ".txt");
                if (!File.Exists(FileName))
                {
                    File.Create(FileName).Dispose();
                    string str = "\r\n=========================================================================================================="
                               + "\r\n                                               LaylaERP                                                   "
                               + "\r\n                                    Accounting | Billing | Inventory                                      "
                               + "\r\n==========================================================================================================";
                    strErrorLog.Insert(0, str);
                }
                StreamWriter objStreamWriter = new StreamWriter(FileName, true);// Open for appending!
                objStreamWriter.WriteLine(strErrorLog);
                objStreamWriter.Close();
            }
            catch { }
        }
    }
}
