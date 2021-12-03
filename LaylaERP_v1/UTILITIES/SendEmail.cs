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
    }

}