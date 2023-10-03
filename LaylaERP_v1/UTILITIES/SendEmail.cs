namespace LaylaERP.UTILITIES
{
    using System;
    using System.Collections.Generic;
    using System.Configuration;
    using System.Data;
    using System.IO;
    using System.Linq;
    using System.Net.Mail;
    using System.Net;
    using System.Text;

    public class SendEmail
    {
        public static string SendEmails(string varReceipientEmailId, string strSubject, string strBody, string fileHtml)
        {
            string result = "Your mail has been sent successfuly !";
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (om.SenderEmailID.Length != 0 && om.SenderEmailPwd.Length != 0 && om.SMTPServerName.Length != 0 && om.SMTPServerPortNo.Length != 0)
                {
                    using (MailMessage mm = new MailMessage(om.SenderEmailID.ToString(), varReceipientEmailId, strSubject, strBody))
                    {
                        mm.IsBodyHtml = true;
                        SmtpClient smtp = new SmtpClient();
                        smtp.Host = om.SMTPServerName.ToString(); // "smtp.gmail.com";
                        smtp.EnableSsl = om.SSL;
                        NetworkCredential NetworkCred = new NetworkCredential(om.SenderEmailID.ToString(), om.SenderEmailPwd.ToString());
                        smtp.UseDefaultCredentials = false;
                        smtp.Credentials = NetworkCred;
                        //smtp.Timeout = 5000;
                        //GlobalVariable.strSMTPServerPortNo = "587";
                        smtp.Port = Convert.ToInt32(om.SMTPServerPortNo); // 587;
                        smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                        byte[] inputBytes = Encoding.UTF8.GetBytes(fileHtml);
                        var stream = new System.IO.MemoryStream(inputBytes);
                        mm.Attachments.Add(new Attachment(stream, "invoice.html"));
                        smtp.Send(mm);
                    }
                }
            }
            catch (Exception ex)
            {
                result = "Some problems occurred with the OTP email. Please contact your Administrator!!";

                //throw ex;
            }
            return result;
        }

        public static string SendEmails(string varReceipientEmailId, string strSubject, string strBody)
        {
            string result = "Your mail has been sent successfuly !";
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (om.SenderEmailID.Length != 0 && om.SenderEmailPwd.Length != 0 && om.SMTPServerName.Length != 0 && om.SMTPServerPortNo.Length != 0)
                {
                    using (MailMessage mm = new MailMessage(om.SenderEmailID.ToString(), varReceipientEmailId, strSubject, strBody))
                    {
                        mm.IsBodyHtml = true;
                        SmtpClient smtp = new SmtpClient();
                        smtp.Host = om.SMTPServerName.ToString(); // "smtp.gmail.com";
                        smtp.EnableSsl = om.SSL;
                        NetworkCredential NetworkCred = new NetworkCredential(om.SenderEmailID.ToString(), om.SenderEmailPwd.ToString());
                        smtp.UseDefaultCredentials = true;//false;
                        smtp.Credentials = NetworkCred;
                        //smtp.Timeout = 5000;
                        //GlobalVariable.strSMTPServerPortNo = "587";
                        smtp.Port = 587; //Convert.ToInt32(om.SMTPServerPortNo); 
                        smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                        smtp.Send(mm);
                    }
                }
            }
            catch (Exception ex)
            {
                result = "Some problems occurred with the OTP email. Please contact your Administrator!!";

                //throw ex;
            }
            return result;
        }

        public string SendEmailToUser(string varReceipientEmailId, string varOTP)
        {
            string result = "Your mail has been sent successfuly !";
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (om.SenderEmailID.Length != 0 && om.SenderEmailPwd.Length != 0 && om.SMTPServerName.Length != 0 && om.SMTPServerPortNo.Length != 0)
                {
                    using (MailMessage mm = new MailMessage(om.SenderEmailID.ToString(), varReceipientEmailId.ToString()))
                    {

                        mm.Subject = "User Information";
                        if (varOTP == "")
                            mm.Body = "This is auto generated email having related to change your details.";
                        else
                            mm.Body = "Your OTP is " + varOTP + " OTP is expired after 180 seconds.";

                        //mm.IsBodyHtml = false;
                        SmtpClient smtp = new SmtpClient();
                        smtp.Host = om.SMTPServerName.ToString(); // "smtp.gmail.com";
                        smtp.EnableSsl = true;
                        NetworkCredential NetworkCred = new NetworkCredential(om.SenderEmailID.ToString(), om.SenderEmailPwd.ToString());
                        smtp.UseDefaultCredentials = true; //false;
                        smtp.Credentials = NetworkCred;
                        //smtp.Timeout = 5000;
                        //GlobalVariable.strSMTPServerPortNo = "587";
                        smtp.Port = Convert.ToInt32(om.SMTPServerPortNo); // 587;
                        smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                        smtp.Send(mm);

                    }
                }
            }
            catch (Exception ex)
            {
                result = "Some problems occurred with the OTP email. Please contact your Administrator!!";

                //throw ex;
            }
            return result;
        }

        public static string SendEmails(string SenderEmailID, string SenderEmailPwd, string SMTPServerName, int SMTPServerPortNo, bool SSL, string varReceipientEmailId, string strSubject, string strBody, string fileHtml)
        {
            string result = "Your mail has been sent successfuly !";
            try
            {
                using (MailMessage mm = new MailMessage(SenderEmailID.ToString(), varReceipientEmailId, strSubject, strBody))
                {
                    mm.IsBodyHtml = true;
                    SmtpClient smtp = new SmtpClient();
                    smtp.Host = SMTPServerName.Trim(); // "smtp.gmail.com";
                    smtp.EnableSsl = SSL;
                    NetworkCredential NetworkCred = new NetworkCredential(SenderEmailID.Trim(), SenderEmailPwd.Trim());
                    smtp.UseDefaultCredentials = true;//false
                    smtp.Credentials = NetworkCred;
                    //smtp.Timeout = 5000;
                    //GlobalVariable.strSMTPServerPortNo = "587";
                    smtp.Port = SMTPServerPortNo; // 587;
                    smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                    if (!string.IsNullOrEmpty(fileHtml))
                    {
                        byte[] inputBytes = Encoding.UTF8.GetBytes(fileHtml);
                        var stream = new System.IO.MemoryStream(inputBytes);
                        mm.Attachments.Add(new Attachment(stream, "invoice.html"));
                    }
                    smtp.Send(mm);
                }
            }
            catch (Exception ex)
            {
                result = "Please contact your Administrator!!";
                //throw ex;
            }
            return result;
        }

        public static string SendEmails_outer(string varReceipientEmailId, string strSubject, string strBody, string fileHtml)
        {
            string result = "Your mail has been sent successfuly !";
            try
            {
                string SenderEmailID = "sales@laylaerp.com", SenderEmailPwd = "Presto55555!", SMTPServerName = "mail.laylaerp.com";
                int SMTPServerPortNo = 587;
                bool SSL = false;
                DataTable dt = DAL.SQLHelper.ExecuteDataTable("Select SenderEmailID,SenderEmailPwd,SMTPServerName,SMTPServerPortNo,SSL from wp_system_settings where entity = 1;");
                foreach (DataRow dr in dt.Rows)
                {
                    SenderEmailID = (dr["SenderEmailID"] != Convert.DBNull) ? dr["SenderEmailID"].ToString() : "";
                    SenderEmailPwd = (dr["SenderEmailPwd"] != Convert.DBNull) ? dr["SenderEmailPwd"].ToString() : "";
                    SMTPServerName = (dr["SMTPServerName"] != Convert.DBNull) ? dr["SMTPServerName"].ToString() : "";
                    //SMTPServerPortNo = (dr["SMTPServerPortNo"] != Convert.DBNull) ? Convert.ToInt32(dr["SMTPServerPortNo"].ToString()) : 25;
                    SSL = (dr["SSL"] != Convert.DBNull) ? Convert.ToBoolean(dr["SSL"]) : false;
                }
                using (MailMessage mm = new MailMessage(SenderEmailID.ToString(), varReceipientEmailId, strSubject, strBody))
                {
                    mm.IsBodyHtml = true;
                    SmtpClient smtp = new SmtpClient();
                    smtp.Host = SMTPServerName.Trim(); // "smtp.gmail.com";
                    smtp.EnableSsl = SSL;
                    NetworkCredential NetworkCred = new NetworkCredential(SenderEmailID.Trim(), SenderEmailPwd.Trim());
                    smtp.UseDefaultCredentials = true;//false
                    smtp.Credentials = NetworkCred;
                    //smtp.Timeout = 5000;
                    //GlobalVariable.strSMTPServerPortNo = "587";
                    smtp.Port = SMTPServerPortNo; // 587;
                    smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                    if (!string.IsNullOrEmpty(fileHtml))
                    {
                        byte[] inputBytes = Encoding.UTF8.GetBytes(fileHtml);
                        var stream = new System.IO.MemoryStream(inputBytes);
                        mm.Attachments.Add(new Attachment(stream, "invoice.html"));
                    }
                    smtp.Send(mm);
                }
            }
            catch (Exception ex)
            {
                result = "Please contact your Administrator!!";
                //throw ex;
            }
            return result;
        }
        public static string SendEmails_outer(string varReceipientEmailId, string strSubject, string strBody, string fileHtml, string filename)
        {
            string result = "Your mail has been sent successfuly !";
            try
            {
                string SenderEmailID = "sales@laylaerp.com", SenderEmailPwd = "Presto55555!", SMTPServerName = "mail.laylaerp.com";
                int SMTPServerPortNo = 587;
                bool SSL = false;
                DataTable dt = DAL.SQLHelper.ExecuteDataTable("Select SenderEmailID,SenderEmailPwd,SMTPServerName,SMTPServerPortNo,SSL from wp_system_settings where entity = 1;");
                foreach (DataRow dr in dt.Rows)
                {
                    SenderEmailID = (dr["SenderEmailID"] != Convert.DBNull) ? dr["SenderEmailID"].ToString() : "";
                    SenderEmailPwd = (dr["SenderEmailPwd"] != Convert.DBNull) ? dr["SenderEmailPwd"].ToString() : "";
                    SMTPServerName = (dr["SMTPServerName"] != Convert.DBNull) ? dr["SMTPServerName"].ToString() : "";
                    //SMTPServerPortNo = (dr["SMTPServerPortNo"] != Convert.DBNull) ? Convert.ToInt32(dr["SMTPServerPortNo"].ToString()) : 25;
                    SSL = (dr["SSL"] != Convert.DBNull) ? Convert.ToBoolean(dr["SSL"]) : false;
                }
                using (MailMessage mm = new MailMessage(SenderEmailID.ToString(), varReceipientEmailId, strSubject, strBody))
                {
                    mm.IsBodyHtml = true;
                    SmtpClient smtp = new SmtpClient();
                    smtp.Host = SMTPServerName.Trim(); // "smtp.gmail.com";
                    smtp.EnableSsl = SSL;
                    NetworkCredential NetworkCred = new NetworkCredential(SenderEmailID.Trim(), SenderEmailPwd.Trim());
                    smtp.UseDefaultCredentials = true;//false
                    smtp.Credentials = NetworkCred;
                    //smtp.Timeout = 5000;
                    //GlobalVariable.strSMTPServerPortNo = "587";
                    smtp.Port = SMTPServerPortNo; // 587;
                    smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                    if (!string.IsNullOrEmpty(fileHtml))
                    {
                        byte[] inputBytes = Encoding.UTF8.GetBytes(fileHtml);
                        var stream = new System.IO.MemoryStream(inputBytes);
                        mm.Attachments.Add(new Attachment(stream, filename));
                    }
                    smtp.Send(mm);
                }
            }
            catch (Exception ex)
            {
                result = "Please contact your Administrator!!";
                //throw ex;
            }
            return result;
        }

        public static string Sendattachmentemails(string varReceipientEmailId, string strSubject, string strBody, List<System.Net.Mail.Attachment> attachments)
        {
            string result = "Your mail has been sent successfuly !";
            try
            {
                DataTable dt = LaylaERP.BAL.EmailProfileRepository.email_detils(1);
                string server_name = null, user_id = null, password = null, email_address = null;
                int port = 0; bool is_seen = false, is_attached = false;
                if (dt != null && dt.Rows.Count > 0)
                {
                    server_name = dt.Rows[0]["imap4_server"].ToString(); user_id = dt.Rows[0]["imapuser_name"].ToString(); password = dt.Rows[0]["imapuser_password"].ToString(); port = Convert.ToInt32(dt.Rows[0]["imap_port"].ToString());
                }
                string SenderEmailID = user_id;
                string SenderEmailPwd = password;
                string SMTPServerName = server_name;
                //string SMTPServerName = ConfigurationManager.AppSettings["Host"];
                int SMTPServerPortNo = 587;
                if (!string.IsNullOrEmpty(SenderEmailID) && !string.IsNullOrEmpty(SenderEmailPwd) && !string.IsNullOrEmpty(SMTPServerName) && SMTPServerPortNo != 0)
                {
                    using (MailMessage mm = new MailMessage(SenderEmailID, varReceipientEmailId, strSubject, strBody))
                    {
                        mm.IsBodyHtml = true;
                        SmtpClient smtp = new SmtpClient();
                        smtp.Host = SMTPServerName; // "smtp.gmail.com";
                        smtp.EnableSsl = false;
                        NetworkCredential NetworkCred = new NetworkCredential(SenderEmailID, SenderEmailPwd);
                        smtp.UseDefaultCredentials = false;//false;
                        smtp.Credentials = NetworkCred;

                        //smtp.Timeout = 5000;
                        //GlobalVariable.strSMTPServerPortNo = "587";
                        smtp.Port = SMTPServerPortNo; //Convert.ToInt32(om.SMTPServerPortNo); 
                        smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                        //byte[] inputBytes = Encoding.UTF8.GetBytes(importFile);
                        //var stream = new System.IO.MemoryStream(inputBytes);
                        //mm.Attachments.Add(new Attachment(stream, "invoice.html"));
                        foreach (var attachment in attachments)
                        {
                            mm.Attachments.Add(attachment);
                        }
                        //smtp.Timeout = 10000;
                        smtp.Send(mm);

                        //ExchangeService service = new ExchangeService();
                        //service.AutodiscoverUrl("youremailaddress@yourdomain.com");

                        //EmailMessage message = new EmailMessage(service);
                        //message.Subject = subjectTextbox.Text;
                        //message.Body = bodyTextbox.Text;
                        //message.ToRecipients.Add(recipientTextbox.Text);
                        //message.Save();

                        //message.SendAndSaveCopy();

                    }
                }
            }
            catch (Exception ex)
            {

                result = "Some problems occurred with the OTP email. Please contact your Administrator!!";
            }
            return result;
        }


        //public async System.Threading.Tasks.Task SendEmails_outerAsync(string varReceipientEmailId, string strSubject, string strBody, string fileHtml, string filename)
        //{
        //    string result = "Your mail has been sent successfuly !";
        //    try
        //    {
        //        string SenderEmailID = "sales@laylaerp.com", SenderEmailPwd = "Presto55555!", SMTPServerName = "mail.laylaerp.com";
        //        int SMTPServerPortNo = 587;
        //        bool SSL = false;
        //        DataTable dt = DAL.SQLHelper.ExecuteDataTable("Select SenderEmailID,SenderEmailPwd,SMTPServerName,SMTPServerPortNo,SSL from wp_system_settings where entity = 1;");
        //        foreach (DataRow dr in dt.Rows)
        //        {
        //            SenderEmailID = (dr["SenderEmailID"] != Convert.DBNull) ? dr["SenderEmailID"].ToString() : "";
        //            SenderEmailPwd = (dr["SenderEmailPwd"] != Convert.DBNull) ? dr["SenderEmailPwd"].ToString() : "";
        //            SMTPServerName = (dr["SMTPServerName"] != Convert.DBNull) ? dr["SMTPServerName"].ToString() : "";
        //            //SMTPServerPortNo = (dr["SMTPServerPortNo"] != Convert.DBNull) ? Convert.ToInt32(dr["SMTPServerPortNo"].ToString()) : 25;
        //            SSL = (dr["SSL"] != Convert.DBNull) ? Convert.ToBoolean(dr["SSL"]) : false;
        //        }
        //        using (MailMessage mm = new MailMessage(SenderEmailID.ToString(), varReceipientEmailId, strSubject, strBody))
        //        {
        //            mm.IsBodyHtml = true;
        //            SmtpClient smtp = new SmtpClient();
        //            smtp.Host = SMTPServerName.Trim(); // "smtp.gmail.com";
        //            smtp.EnableSsl = SSL;
        //            NetworkCredential NetworkCred = new NetworkCredential(SenderEmailID.Trim(), SenderEmailPwd.Trim());
        //            smtp.UseDefaultCredentials = true;//false
        //            smtp.Credentials = NetworkCred;
        //            //smtp.Timeout = 5000;
        //            //GlobalVariable.strSMTPServerPortNo = "587";
        //            smtp.Port = SMTPServerPortNo; // 587;
        //            smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
        //            if (!string.IsNullOrEmpty(fileHtml))
        //            {
        //                byte[] inputBytes = Encoding.UTF8.GetBytes(fileHtml);
        //                var stream = new System.IO.MemoryStream(inputBytes);
        //                mm.Attachments.Add(new Attachment(stream, filename));
        //            }
        //            //smtp.Send(mm);
        //            await smtp.SendMailAsync(mm);

        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        result = "Please contact your Administrator!!";
        //        //throw ex;
        //    }
        //    //return result;
        //}
    }

}