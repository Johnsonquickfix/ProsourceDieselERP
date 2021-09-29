using LaylaERP.DAL;
using LaylaERP.Models;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;

namespace LaylaERP.BAL
{
    public class EmailNotificationsRepository
    {
        public static string emailfromname()
        {
            string value = "";
            string strQuery = "select option_value from wp_options where option_name = 'woocommerce_email_from_name'";
            value = SQLHelper.ExecuteScalar(strQuery).ToString();
            return value;
        } 
        public static string emailfromaddress()
        {
            string value = "";
            string strQuery = "select option_value from wp_options where option_name = 'woocommerce_email_from_address'";
            value = SQLHelper.ExecuteScalar(strQuery).ToString();
            return value;
        }
        public static string emailheaderimage()
        {
            string value = "";
            string strQuery = "select option_value from wp_options where option_name = 'woocommerce_email_header_image'";
            value = SQLHelper.ExecuteScalar(strQuery).ToString();
            return value;
        }
        public static string emailfootertext()
        {
            string value = "";
            string strQuery = "select option_value from wp_options where option_name = 'woocommerce_email_footer_text'";
            value = SQLHelper.ExecuteScalar(strQuery).ToString();
            return value;
        }
        public static DataTable GetEmailList(string strValue1, string userstatus, string strValue3, string strValue4, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "order_id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (rowid like '%" + searchid + "%' "
                            + " OR email_notify_key like '%" + searchid + "%' "
                            + " OR email_text like '%" + searchid + "%' "
                            + " OR email_content_type like '%" + searchid + "%' "
                            + " OR recipients like '%" + searchid + "%' "
                            + " )";
                }
                string strSql = "select rowid,email_notify_key,email_text,email_content_type,et.is_active,recipients"
                + " from erp_email_notify_options eno"
                + " left outer join  erp_email_templates et on et.option_name = eno.email_notify_key"
                + " WHERE rowid > 0" + strWhr

              + " order by " + SortCol + " " + SortDir + " limit " + (pageno).ToString() + ", " + pagesize + "";

                strSql += "; SELECT count(distinct rowid) TotalRecord from erp_email_notify_options eno"
                + " left outer join  erp_email_templates et on et.option_name = eno.email_notify_key"
                + " WHERE rowid > 0" + strWhr.ToString();
                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
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

        public static DataTable Getoption_Details(EmailSettingModel model)
        {
            DataTable dt = new DataTable();
            try
            {
                string strSQl = "select option_name from erp_email_templates"
                                + " WHERE option_name = '" + model.option_name + "' "
                                + " limit 10;";
                dt = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static int AddEmailNotification(EmailSettingModel model)
        {
            int result = 0;
            try
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append(string.Format("insert into erp_email_templates (option_name,recipients,subject,email_heading,additional_content,email_type,is_active) values ('{0}','{1}','{2}','{3}','{4}','{5}',{6}); ", model.option_name, model.recipients, model.subject, model.email_heading, model.additional_content, model.email_type, model.is_active));
                result = SQLHelper.ExecuteNonQuery(strSql.ToString());
            }
            catch (Exception ex)
            { throw ex; }
            return result;
        }

        public static int updateEmailNotification(EmailSettingModel model)
        {
            int result = 0;
            try
            {
                StringBuilder strSql = new StringBuilder();                
                strSql.Append(string.Format("update erp_email_templates set recipients = '{0}' ,subject = '{1}',email_heading = '{2}',additional_content = '{3}',email_type = '{4}',is_active = {5} where option_name = '{6}' ;", model.recipients, model.subject, model.email_heading, model.additional_content, model.email_type, model.is_active, model.option_name));
                strSql.Append(string.Format("update erp_email_notify_options set is_active  = {0} where email_notify_key = '{1}' ;", model.is_active, model.option_name));
                result = SQLHelper.ExecuteNonQuery(strSql.ToString());
            }
            catch (Exception ex)
            { throw ex; }
            return result;
        }
        public static EmailSettingModel GetDetails(string optionname)
        {
            EmailSettingModel EmailSetting = new EmailSettingModel();

            try
            {

                EmailSetting.recipients = EmailSetting.subject = EmailSetting.email_heading = EmailSetting.additional_content = EmailSetting.email_type = string.Empty;
                EmailSetting.email_type = "email_pln_text";
                EmailSetting.is_active = 0;
                string strWhr = string.Empty;

                string strSql = "SELECT recipients,subject,email_heading,additional_content,email_type,is_active"
                             + " FROM erp_email_templates P"
                             + " WHERE P.option_name = '" + optionname + "' ";

                MySqlDataReader sdr = SQLHelper.ExecuteReader(strSql);
                if (sdr != null)
                {
                    while (sdr.Read())
                    {                       
                        if (sdr["recipients"] != DBNull.Value)
                            EmailSetting.recipients = sdr["recipients"].ToString();
                        else
                            EmailSetting.recipients = string.Empty;

                        if (sdr["subject"] != DBNull.Value)
                            EmailSetting.subject = sdr["subject"].ToString();
                        else
                            EmailSetting.subject = string.Empty;

                        if (sdr["email_heading"] != DBNull.Value)
                            EmailSetting.email_heading = sdr["email_heading"].ToString();
                        else
                            EmailSetting.email_heading = string.Empty;

                        if (sdr["additional_content"] != DBNull.Value)
                            EmailSetting.additional_content = sdr["additional_content"].ToString();
                        else
                            EmailSetting.additional_content = string.Empty;

                        if (sdr["email_type"] != DBNull.Value)
                            EmailSetting.email_type = sdr["email_type"].ToString();
                        else
                            EmailSetting.email_type = "email_pln_text";

                        if (sdr["is_active"] != DBNull.Value)
                            EmailSetting.is_active = Convert.ToInt32(sdr["is_active"].ToString());
                        else
                            EmailSetting.is_active = 0;
                    }
                }
               
                   
              

                //DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                //dt = ds.Tables[0];

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return EmailSetting;
        }
        public static void UpdateMetaData(string id, string varFieldsName, string varFieldsValue)
        {
            try
            {
                string strsql = "update wp_options set option_value=@option_value where option_id=@option_id and option_name=@option_name";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@option_id", id),
                    new MySqlParameter("@option_name", varFieldsName),
                    new MySqlParameter("@option_value", varFieldsValue),
                };
                SQLHelper.ExecuteNonQuery(strsql, para);
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
    }
}