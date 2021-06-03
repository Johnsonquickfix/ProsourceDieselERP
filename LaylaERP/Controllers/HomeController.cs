namespace LaylaERP.Controllers
{
    using LaylaERP.UTILITIES;
    using System;
    using System.Collections.Generic;
    using System.Configuration;
    using System.Linq;
    using System.Net.Mail;
    using System.Web;
    using System.Web.Mvc;
    using System.Data;
    using LaylaERP.Models;
    using Newtonsoft.Json;
    using System.Globalization;

    public class HomeController : Controller
    {
        public ActionResult Login()
        {
            CommanUtilities.Provider.RemoveCurrent();
            return View();
        }
       
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Dashboard()
        {
            CultureInfo us = new CultureInfo("en-US");
            ViewBag.totalorders = Convert.ToDecimal(BAL.DashboardRepository.Total_Orders()).ToString("N0",us); //BAL.DashboardRepository.Total_Orders();
            ViewBag.totalsales = Convert.ToDecimal(BAL.DashboardRepository.Total_Sales()).ToString("N2",us);
            ViewBag.totalcustomers = Convert.ToDecimal(BAL.DashboardRepository.Total_Customer()).ToString("N0",us);
            ViewBag.totalordercompleted = Convert.ToDecimal(BAL.DashboardRepository.Total_Order_Completed()).ToString("N0",us);
            return View();
        }
        public ActionResult MobileVerification()
        {
            Random _rdm = new Random();
            int OTP = _rdm.Next(1000, 9999);
            Session["OTP"] = OTP;

            using (MailMessage mailMessage = new MailMessage())

            {

                mailMessage.From = new MailAddress(ConfigurationManager.AppSettings["UserName"], "Lyra ERP");

                mailMessage.Subject = "Your OTP for verifiction....";

                mailMessage.Body = "Your OTP is" + OTP;

                mailMessage.IsBodyHtml = true;

                mailMessage.To.Add(new MailAddress("contact.prashantpal@gmail.com"));

                SmtpClient smtp = new SmtpClient();

                smtp.Host = ConfigurationManager.AppSettings["Host"];

                smtp.EnableSsl = Convert.ToBoolean(ConfigurationManager.AppSettings["EnableSsl"]);

                System.Net.NetworkCredential NetworkCred = new System.Net.NetworkCredential();

                NetworkCred.UserName = ConfigurationManager.AppSettings["UserName"]; //reading from web.config  

                NetworkCred.Password = ConfigurationManager.AppSettings["Password"]; //reading from web.config  

                smtp.UseDefaultCredentials = true;

                smtp.Credentials = NetworkCred;

                smtp.Port = int.Parse(ConfigurationManager.AppSettings["Port"]); //reading from web.config  

                smtp.Send(mailMessage);

            }




            return View();
        }
        [HttpPost]
        public ActionResult MobileVerification(int OTP)
        {
            if (Convert.ToInt32(Session["OTP"]) == OTP)
            {

                return RedirectToAction("Index", "Home");
            }
            else
            {
                ViewBag.Result = "Verification Faild...";
            }

            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}