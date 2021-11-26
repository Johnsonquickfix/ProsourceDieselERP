using LaylaERP.Controllers;
using LaylaERP.UTILITIES;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;

namespace LaylaERP_v1.Controllers
{
    public class PromotionalEmailController : Controller
    {
        // GET: PromotionalEmail
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult PromoEmail()
        {
            return View();
        }

        [HttpPost]
        public ActionResult PromoEmail(string emails, string subject, string content)
        {
            bool result = false;
            try
            {
                string strEmail = string.Empty;
                List<string> lstEmail = emails.Split(',').ToList();
                for (int i = 0; i < lstEmail.Count; i++)
                {
                    bool isEmail = Regex.IsMatch(lstEmail[i], @"\A(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)\Z", RegexOptions.IgnoreCase);
                    if (isEmail)
                        strEmail += (strEmail.Length > 0 ? ";" : "") + lstEmail[i];
                }

                //SendEmail.SendEmails(emails, subject, content);
                SendEmails(emails, subject, content);
                result = true;
            }
            catch { result = false; }
            return Json(result, 0);
        }

        public JsonResult SendMailInvoice(string emails, string subject, string content)
        {
            string result = string.Empty;
            bool status = false;
            try
            {
                status = true;
                //String renderedHTML = EmailNotificationsController.RenderViewToString("EmailNotifications", "GiftCardOrder", model);

                //result = SendEmail.SendEmails(model.b_email, "Your order #" + model.order_id + " has been received", renderedHTML);
                result = SendEmail.SendEmails(emails,subject, content);
            }
            catch { status = false; result = ""; }
            return Json(new { status = status, message = result }, 0);
        }

        public static string SendEmails(string varReceipientEmailId, string strSubject, string strBody)
        {
            string result = "Your mail has been sent successfuly !";
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                string SenderEmailID = "david.quickfix1@gmail.com";
                string SenderEmailPwd = "Quick!123";
                string SMTPServerPortNo = "587";
                string SMTPServerName = "smtp.gmail.com";
                    using (MailMessage mm = new MailMessage(SenderEmailID.ToString(), varReceipientEmailId, strSubject, strBody))
                    {
                        mm.IsBodyHtml = true;
                        SmtpClient smtp = new SmtpClient();
                        smtp.Host = SMTPServerName.ToString(); // "smtp.gmail.com";
                        smtp.EnableSsl = true;
                        NetworkCredential NetworkCred = new NetworkCredential(SenderEmailID.ToString(), SenderEmailPwd.ToString());
                        smtp.UseDefaultCredentials = false;
                        smtp.Credentials = NetworkCred;
                        smtp.Port = Convert.ToInt32(SMTPServerPortNo);
                        smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                        smtp.Send(mm);
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