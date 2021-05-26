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
        public void SendEmailToUser(string varReceipientEmailId, string varOTP)
        {
            try
            {
                GlobalVariable.strEmailNotSendMsg = string.Empty;
                if (GlobalVariable.strSenderEmailId.ToString().Length != 0 && GlobalVariable.strSenderEmailPwd.ToString().Length != 0 && GlobalVariable.strSMTPServerName.ToString().Length != 0 && GlobalVariable.strSMTPServerPortNo.ToString().Length != 0)
                {
                    using (MailMessage mm = new MailMessage(GlobalVariable.strSenderEmailId.ToString(), varReceipientEmailId.ToString()))
                    {

                        mm.Subject = "User Information";
                        if (varOTP == "")
                            mm.Body = "This is auto generated email having related to change your details.";
                        else
                            mm.Body = "Your OTP is " + varOTP + " OTP is expired after 180 seconds.";

                        //mm.IsBodyHtml = false;
                        SmtpClient smtp = new SmtpClient();
                        smtp.Host = GlobalVariable.strSMTPServerName.ToString(); // "smtp.gmail.com";
                        smtp.EnableSsl = true;
                        NetworkCredential NetworkCred = new NetworkCredential(GlobalVariable.strSenderEmailId.ToString(), GlobalVariable.strSenderEmailPwd.ToString());
                        smtp.UseDefaultCredentials = false;
                        smtp.Credentials = NetworkCred;
                        //smtp.Timeout = 5000;
                        //GlobalVariable.strSMTPServerPortNo = "587";
                        smtp.Port = Convert.ToInt32(GlobalVariable.strSMTPServerPortNo.ToString()); // 587;
                        smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                        smtp.Send(mm);
                    }
                }
            }
            catch (Exception ex)
            {
                //adderrorlog(ex.Message.ToString(), " Email Status ");
                //GlobalVariable.strEmailNotSendMsg = "Some problems occurred with the OTP email. Please contact your Administrator!! ";
                throw ex;
            }
        }

        public void SendEmailToCustomer(string varReceipientEmailId, string varfilepath, string varBodyMessage)
        {
            try
            {
                GlobalVariable.strEmailNotSendMsg = string.Empty;
                if (GlobalVariable.strSenderEmailId.ToString().Length != 0 && GlobalVariable.strSenderEmailPwd.ToString().Length != 0 && GlobalVariable.strSMTPServerName.ToString().Length != 0 && GlobalVariable.strSMTPServerPortNo.ToString().Length != 0)
                {
                    using (MailMessage mm = new MailMessage(GlobalVariable.strSenderEmailId.ToString(), varReceipientEmailId.ToString()))
                    {

                        mm.Subject = "Order Information";

                        mm.Body = varBodyMessage + "\n" + "This is auto generated email having related to your order details.";



                        if (varfilepath.Length != 0)
                            mm.Attachments.Add(new Attachment(varfilepath));
                        //mm.IsBodyHtml = false;
                        SmtpClient smtp = new SmtpClient();
                        smtp.Host = GlobalVariable.strSMTPServerName.ToString(); // "smtp.gmail.com";
                        smtp.EnableSsl = true;
                        NetworkCredential NetworkCred = new NetworkCredential(GlobalVariable.strSenderEmailId.ToString(), GlobalVariable.strSenderEmailPwd.ToString());
                        smtp.UseDefaultCredentials = false;
                        smtp.Credentials = NetworkCred;
                        //smtp.Timeout = 5000;
                        //GlobalVariable.strSMTPServerPortNo = "587";
                        smtp.Port = Convert.ToInt32(GlobalVariable.strSMTPServerPortNo.ToString()); // 587;
                        smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                        smtp.Send(mm);
                    }
                }
            }
            catch (Exception ex)
            {
                //adderrorlog(ex.Message.ToString(), " Email Status ");
                GlobalVariable.strEmailNotSendMsg = "Some problems occurred with the OTP email. Please contact your Administrator!! ";
            }
        }


    }

}