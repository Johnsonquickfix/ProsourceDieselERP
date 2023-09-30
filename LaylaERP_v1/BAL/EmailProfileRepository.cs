using LaylaERP.DAL;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace LaylaERP.BAL
{
    public class EmailProfileRepository
    {
        public static DataTable email_detils(int entity)
        {
            DataTable dt = new DataTable();
            try
            {
                string strSQl = "select rowid,entity,imap4_server,imapuser_name,imapuser_password,imap_port from erp_entityinfo"
                                + " WHERE entity = " + entity + " "
                                + " ;";
                dt = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static int AddMails(int company_id,string email_address,string subject,string direction,bool is_read,bool is_deleted,string html_content,string text_content,string MessageId,string in_reply_to,bool is_attached,string UniqueId)
        {
            try
            {
                SqlParameter[] para = {
                    new SqlParameter("@qflag","I"),
                    new SqlParameter("@company_id", company_id),
                    new SqlParameter("@email_address",email_address),
                    new SqlParameter("@subject", subject),
                    new SqlParameter("@direction", direction),
                    new SqlParameter("@is_read", is_read),
                    new SqlParameter("@is_deleted", is_deleted),
                    new SqlParameter("@html_content", html_content),
                    new SqlParameter("@text_content", text_content),
                    new SqlParameter("@message_id", MessageId),
                    new SqlParameter("@in_reply_to ", in_reply_to),
                    new SqlParameter("@is_attached", is_attached),
                    new SqlParameter("@unique_id", UniqueId),

                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar("cms_Profile_email_insert", para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static DataTable GetmailList(string strValue1, string mail_status, string flag, string strValue4, string searchid, int pageno, int pagesize,   out int totalrows, string SortCol = "ID", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                SqlParameter[] parameters =
               {

                    new SqlParameter("@mail_status", mail_status),
                   new SqlParameter("@searchcriteria", searchid),
                    new SqlParameter("@strValue1", strValue1),
                    new SqlParameter("@pageno", pageno),
                    new SqlParameter("@pagesize", pagesize),
                    new SqlParameter("@sortcol", SortCol),
                    new SqlParameter("@sortdir", SortDir),
                    new SqlParameter("@flag", flag)
                };

                DataSet ds = SQLHelper.ExecuteDataSet("cms_emailprofile_search", parameters);
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

        public static DataTable GetmailCount()
        {
            DataTable dt = new DataTable();
            try
            {
                string strWhr = string.Empty;
                SqlParameter[] para = { new SqlParameter("@qflag", "CNTML"), };
                string strSql = "cms_countmail";
                dt = SQLHelper.ExecuteDataTable(strSql, para);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static DataTable GetMailByID(int ID)
        {
            DataTable dt = new DataTable();

            try
            {
                string strWhr = string.Empty;

                SqlParameter[] parameters =
                 {
                    new SqlParameter("@condition", ""),
                    new SqlParameter("@flag", "ByID"),
                    new SqlParameter("@id",ID),
                };
                DataTable ds = new DataTable();
                dt = DAL.SQLHelper.ExecuteDataTable("cms_mailbyid", parameters);

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

    }
}