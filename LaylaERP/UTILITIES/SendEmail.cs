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

    public class SendEmail
    {
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
                        smtp.EnableSsl = true;
                        NetworkCredential NetworkCred = new NetworkCredential(om.SenderEmailID.ToString(), om.SenderEmailPwd.ToString());
                        smtp.UseDefaultCredentials = false;
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
                        smtp.UseDefaultCredentials = false;
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
    }

}