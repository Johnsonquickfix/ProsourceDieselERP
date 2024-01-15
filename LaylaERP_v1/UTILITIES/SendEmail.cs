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
    using System.Threading;
    using System.Threading.Tasks;

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
                string SenderEmailID = "info@new.prosourcediesel.com", SenderEmailPwd = "Peter@007", SMTPServerName = "new.prosourcediesel.com";
                int SMTPServerPortNo = 465;
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
                string SenderEmailID = "info@new.prosourcediesel.com", SenderEmailPwd = "Peter@007", SMTPServerName = "new.prosourcediesel.com";
                int SMTPServerPortNo = 465;
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
                        smtp.Port = SMTPServerPortNo; //Convert.ToInt32(om.SMTPServerPortNo); 
                        smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                        foreach (var attachment in attachments)
                        {
                            mm.Attachments.Add(attachment);
                        }
                        //smtp.Timeout = 10000;
                        smtp.Send(mm);

                        // On sent box show mail
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

        public static string PushEmails(string strFromName, string strFromMail, string strReplyTo, string strReceipientEmailId, string strSubject, string strBody)
        {
            string result = "Your mail has been sent successfuly !";
            try
            {
                //IConfiguration AppSetting = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory()).AddJsonFile("appsettings.json").Build();
                //string SenderEmailID = AppSetting["MailInfo:UserName"], SenderEmailPwd = AppSetting["MailInfo:Password"], SMTPServerName = AppSetting["MailInfo:Host"];
                //int SMTPServerPortNo = !string.IsNullOrEmpty(AppSetting["MailInfo:Port"]) ? Convert.ToInt32(AppSetting["MailInfo:Port"]) : 587;

                DataTable dt = LaylaERP.BAL.EmailProfileRepository.email_detils(1);
                string SMTPServerName = null, SenderEmailID = null, SenderEmailPwd = null, email_address = null;
                int SMTPServerPortNo = 0; bool is_seen = false, is_attached = false;
                if (dt != null && dt.Rows.Count > 0)
                {
                    SMTPServerName = dt.Rows[0]["imap4_server"].ToString(); SenderEmailID = dt.Rows[0]["imapuser_name"].ToString(); SenderEmailPwd = dt.Rows[0]["imapuser_password"].ToString(); SMTPServerPortNo = Convert.ToInt32(dt.Rows[0]["imap_port"].ToString());
                }

                //string SMTPServerName = ConfigurationManager.AppSettings["Host"];
                SMTPServerPortNo = 587;

                using (MailMessage mm = new MailMessage(SenderEmailID, strFromMail, strSubject, strBody))
                {
                    mm.IsBodyHtml = true;
                    SmtpClient smtp = new SmtpClient();
                    smtp.Host = SMTPServerName; // "smtp.gmail.com";
                    smtp.EnableSsl = false;
                    NetworkCredential NetworkCred = new NetworkCredential(SenderEmailID, SenderEmailPwd);
                    smtp.UseDefaultCredentials = false;//false;
                    smtp.Credentials = NetworkCred;
                    smtp.Port = SMTPServerPortNo; //Convert.ToInt32(om.SMTPServerPortNo); 
                    smtp.DeliveryMethod = SmtpDeliveryMethod.Network;

                    //smtp.Timeout = 10000;
                    smtp.Send(mm);



                }

            }
            catch
            {
                result = "Some problems occurred with the OTP email. Please contact your Administrator!!";
            }
            return result;
        }

        public static string SendEmails(string to_name, string to_email, string from_name, string from_email, string reply_to_email, string bcc_email, string cc_email, string sSubject, string sBody, bool EnableSsl)
        {
            //string result = "Your mail has been sent successfuly !";
            string result = "sent";
            try
            {
                string sender_email = "david.quickfix1@gmail.com", sender_email_Pwd = "beukxoqkukghwzvp";
                string SMTPServerName = "smtp.gmail.com";
                int SMTPServerPortNo = 587;
                //string SMTPServerName = ConfigurationManager.AppSettings["Host"];
                //int SMTPServerPortNo = !string.IsNullOrEmpty(ConfigurationManager.AppSettings["Port"]) ? Convert.ToInt32(ConfigurationManager.AppSettings["Port"]) : 587;
                var th = new Thread(() =>
                {
                    if (!string.IsNullOrEmpty(sender_email) && !string.IsNullOrEmpty(sender_email_Pwd) && !string.IsNullOrEmpty(SMTPServerName) && SMTPServerPortNo != 0)
                    {
                        MailMessage mail = new MailMessage();
                        SmtpClient SmtpServer = new SmtpClient(host: SMTPServerName);
                        mail.From = new MailAddress(from_email, from_name);
                        mail.To.Add(new MailAddress(to_email, to_name));
                        if (!string.IsNullOrEmpty(reply_to_email)) mail.ReplyToList.Add(new MailAddress(reply_to_email, string.Empty));
                        if (!string.IsNullOrEmpty(cc_email)) mail.CC.Add(new MailAddress(cc_email, string.Empty));
                        if (!string.IsNullOrEmpty(bcc_email)) mail.Bcc.Add(new MailAddress(bcc_email, string.Empty));
                        
                        mail.Subject = sSubject;
                        mail.IsBodyHtml = true;
                        mail.Body = sBody;
                        
                        NetworkCredential NetworkCred = new NetworkCredential(sender_email, sender_email_Pwd);
                        SmtpServer.UseDefaultCredentials = false;//false;
                        SmtpServer.Credentials = NetworkCred;
                        SmtpServer.EnableSsl = EnableSsl;
                        SmtpServer.Port = SMTPServerPortNo;
                        SmtpServer.DeliveryMethod = SmtpDeliveryMethod.Network;
                        SmtpServer.Send(mail);
                    }
                });
                th.SetApartmentState(ApartmentState.STA);
                th.Start();
                Task.Run(() => th);
                Task.WaitAll();
            }
            catch //(Exception ex)
            {
                //result = "Some problems occurred with the OTP email. Please contact your Administrator!!";
                result = "not sent";
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