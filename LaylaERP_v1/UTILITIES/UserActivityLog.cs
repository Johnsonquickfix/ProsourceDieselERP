namespace LaylaERP.UTILITIES
{
    using System;
    using System.ComponentModel;
    using System.Data;
    using System.IO;
    using System.Management;
    using System.Net;
    using System.Net.Sockets;
    using System.Text;
    using System.Web;
    using LaylaERP.DAL;
    using System.Data.SqlClient;

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

            try
            {
                OperatorModel OM = CommanUtilities.Provider.GetCurrent();
                long userid = CommanUtilities.Provider.GetCurrent().UserID;
                string strSql = "INSERT INTO wp_users_activitylog(user_id,log_date,log_type_id,ip_address,mac_id,module_name,description) VALUES(@user_id,@log_date,@log_type_id,@ip_address,@mac_id,@module_name,@description)";

                SqlParameter[] parameters =
                {
                    new SqlParameter("@user_id", OM.UserID),
                    new SqlParameter("@log_date", DateTime.Now),
                    new SqlParameter("@log_type_id", Convert.ToInt32(logType)),
                    new SqlParameter("@ip_address", OM.LoginIPAddress),
                    new SqlParameter("@mac_id", OM.LoginMacAddress),
                    new SqlParameter("@module_name", moduleName),
                    new SqlParameter("@description", resultLog)
                };
                result = SQLHelper.ExecuteNonQuery(strSql, parameters);
            }
            catch { }
            return result;
        }

        public static DataTable GetActivityLog(long userid, DateTime fromdate, DateTime todate, int pageno, int pagesize, out int totalrows)
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;

                //string strSql = "SELECT  " + (pageno - pageno).ToString() + " + ROW_NUMBER() OVER(Order BY log_date DESC) ROWNUM,ual.user_id,User_Login,user_email,cast(log_date as date) log_date_on,DATE_FORMAT(log_date, '%a %b %e %Y %H:%i') log_date,ip_address,mac_id,module_name,description,log_type_id,"
                //            + " CASE log_type_id WHEN 0 THEN 'Other' WHEN 1 THEN 'Log In' WHEN 2 THEN 'Log Out' WHEN 3 THEN 'Access' WHEN 4 THEN 'Added' WHEN 5 THEN 'Delete' WHEN 6 THEN 'Modify' WHEN 7 THEN 'Submit' END log_type"
                //            + " FROM wp_users_activitylog ual INNER JOIN wp_users ur ON ur.id = ual.user_id WHERE 1 = 1";
                //if (userid > 0)
                //    strWhr += " and ur.id = " + userid.ToString();
                //strWhr += " and convert(date,log_date) >= convert(date,'" + fromdate.ToString("yyyy-MM-dd") + "') ";
                //strWhr += " and convert(date,log_date) <= convert(date,'" + todate.ToString("yyyy-MM-dd") + "') ";

                //strSql += strWhr + " order by log_date DESC  LIMIT " + (pageno).ToString() + ", " + pagesize.ToString();

                //strSql += "; SELECT ceil(Count(ual.user_id)/" + pagesize.ToString() + ") TotalPage,Count(ual.user_id) TotalRecord FROM wp_users_activitylog ual INNER JOIN wp_users ur ON ur.id = ual.user_id WHERE 1 = 1 " + strWhr.ToString();

                string strSql = "SELECT  " + (pageno - pageno).ToString() + " + ROW_NUMBER() OVER(Order BY log_date DESC) ROWNUM,ual.user_id,User_Login,user_email,cast(log_date as date) log_date_on,FORMAT(log_date,'MM/dd/yyyy hh:mm tt') log_date,ip_address,mac_id,module_name,description,log_type_id,"
                         + " CASE log_type_id WHEN 0 THEN 'Other' WHEN 1 THEN 'Log In' WHEN 2 THEN 'Log Out' WHEN 3 THEN 'Access' WHEN 4 THEN 'Added' WHEN 5 THEN 'Delete' WHEN 6 THEN 'Modify' WHEN 7 THEN 'Submit' END log_type"
                         + " FROM wp_users_activitylog ual INNER JOIN wp_users ur ON ur.id = ual.user_id WHERE 1 = 1";
                if (userid > 0)
                    strWhr += " and ur.id = " + userid.ToString();
                strWhr += " and convert(date,log_date) >= convert(date,'" + fromdate.ToString("yyyy-MM-dd") + "') ";
                strWhr += " and convert(date,log_date) <= convert(date,'" + todate.ToString("yyyy-MM-dd") + "') ";

                //strSql += strWhr + " order by log_date DESC  " + (pageno).ToString() + ", " + pagesize.ToString();

                strSql += strWhr + " order by log_date DESC "  + " OFFSET " + (pageno).ToString() + " ROWS FETCH NEXT " + pagesize + " ROWS ONLY; ";

                strSql += "; SELECT Count(ual.user_id)/" + pagesize.ToString() + " TotalPage,Count(ual.user_id) TotalRecord FROM wp_users_activitylog ual INNER JOIN wp_users ur ON ur.id = ual.user_id WHERE 1 = 1 " + strWhr.ToString();


                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dt = ds.Tables[0];
                if (ds.Tables[1].Rows.Count > 0)
                    totalrows = Convert.ToInt32(ds.Tables[1].Rows[0]["TotalRecord"].ToString());
            }
            catch(Exception ex) { }
            return dt;
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

        public static void ExpectionErrorLog(Exception ex, string URL, string query)
        {
            try
            {
                OperatorModel OM = CommanUtilities.Provider.GetCurrent();
                StringBuilder strErrorLog = new StringBuilder();
                strErrorLog.Append("\r\n ==========================================================================================================");
                strErrorLog.Append("\r\n Date Time: " + System.DateTime.Now.ToString());
                strErrorLog.Append("\r\n URL: " + URL);
                strErrorLog.Append("\r\n Host: " + Net.Host);
                strErrorLog.Append("\r\n IP: " + OM.LoginIPAddress);
                strErrorLog.Append("\r\n Error Query: " + query);
                strErrorLog.Append("\r\n Error: " + ex.Message);
                strErrorLog.Append("\r\n Source : " + ex.Source);
                strErrorLog.Append("\r\n StackTrace: " + ex.StackTrace);
                String FileName = string.Empty;
                if (HttpContext.Current != null)
                    FileName = HttpContext.Current.Server.MapPath("~//AppLog//ExpectionLog" + System.DateTime.Now.Year.ToString() + System.DateTime.Now.Month.ToString() + System.DateTime.Now.Day.ToString() + ".txt");
                else
                    FileName = HttpRuntime.AppDomainAppPath.ToString() + ("AppLog//ExpectionLog" + System.DateTime.Now.Year.ToString() + System.DateTime.Now.Month.ToString() + System.DateTime.Now.Day.ToString() + ".txt");
                if (!File.Exists(FileName))
                {
                    File.Create(FileName).Dispose();
                    string str = "\r\n=========================================================================================================="
                               + "\r\n                                               LaylaERP                                                   "
                               + "\r\n                                             Expection Log                                    "
                               + "\r\n==========================================================================================================";
                    strErrorLog.Insert(0, str);
                }
                StreamWriter objStreamWriter = new StreamWriter(FileName, true);// Open for appending!
                objStreamWriter.WriteLine(strErrorLog);
                objStreamWriter.Close();
            }
            catch(Exception ex1) { throw ex1; }
        }
    }
}
