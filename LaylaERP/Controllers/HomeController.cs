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
    using BAL;

    public class HomeController : Controller
    {
        public ActionResult Login()
        {
           
            CommanUtilities.Provider.RemoveCurrent();
            return View();
        }
        [HttpGet]
        public ActionResult ForgotPassword()
        {
            
            return View();
        }
        [HttpPost]
        public ActionResult ForgotPassword(LoginModel model)
        {
            if (!string.IsNullOrEmpty(model.UserName))
            {
                DataSet u = Users.ForgotPassword(model.UserName);
                DataSet ds = Users.GetEmailCredentials();
                if (u.Tables[0].Rows.Count > 0)
                {
                    string UserName = u.Tables[0].Rows[0]["user_login"].ToString();
                    string Nicename = u.Tables[0].Rows[0]["user_nicename"].ToString();
                    string Email = u.Tables[0].Rows[0]["user_email"].ToString();

                    using (MailMessage mailMessage = new MailMessage())

                    {

                        mailMessage.From = new MailAddress(ConfigurationManager.AppSettings["UserName"], "Layla ERP");

                        mailMessage.Subject = "Request for Reset Password....";

                        mailMessage.Body = "A request for reset password got from UserName : "+UserName+" and Email : "+Email;

                        mailMessage.IsBodyHtml = true;

                        mailMessage.To.Add(new MailAddress("david.quickfix1@gmail.com"));


                        SmtpClient smtp = new SmtpClient();

                        smtp.Host = ds.Tables[0].Rows[0]["SMTPServerName"].ToString();

                        smtp.EnableSsl = Convert.ToBoolean(ConfigurationManager.AppSettings["EnableSsl"]);

                        System.Net.NetworkCredential NetworkCred = new System.Net.NetworkCredential();

                        NetworkCred.UserName = ds.Tables[0].Rows[0]["SenderEmailID"].ToString(); //reading from web.config  

                        NetworkCred.Password = ds.Tables[0].Rows[0]["SenderEmailPwd"].ToString(); //reading from web.config  

                        smtp.UseDefaultCredentials = true;

                        smtp.Credentials = NetworkCred;

                        smtp.Port = Convert.ToInt32(ds.Tables[0].Rows[0]["SMTPServerPortNo"]); //reading from web.config  

                        //smtp.Send(mailMessage);
                       

                    }



                    Session["UserId"] = u.Tables[0].Rows[0]["user_login"].ToString();
                    ViewBag.Result = "Your password recovery query submitted to the administrator. Will contact you soon!!!";
                    
                  
                }
                else
                {
                    ViewBag.Result = "User does not Exist with this User Name.";
                }

            }
            return View();
        }

        [HttpGet]
       public ActionResult ResetPassword()
        {
            return View();
        }
        [HttpPost]
        public ActionResult ResetPassword(LoginModel model)
        {
            if (model.PassWord == model.ConfirmPassword)
            {
                model.UserName = Session["UserId"].ToString();
                int res = Users.ResetPassword(model.UserName,model.PassWord);
                if (res > 0)
                {
                    return RedirectToAction("Login", "Home");
                }
                    
            }
            return View();
        }

        public ActionResult Index()
        {
            clsUserDetails model = new clsUserDetails();
          
            //ViewBag.id = Session["UserId"];
            //-----------Code Start------
            //long id = 0;
            //id = ViewBag.id;
            //if (id > 0)
            //{
                GetUserDetails(model, CommanUtilities.Provider.GetCurrent().UserID);
            //}
            //--------------Code End----------
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
            DataSet ds = Users.GetEmailCredentials();

            Random _rdm = new Random();
            int OTP = _rdm.Next(1000, 9999);
            Session["OTP"] = OTP;
            

            using (MailMessage mailMessage = new MailMessage())

            {

                mailMessage.From = new MailAddress(ConfigurationManager.AppSettings["UserName"], "Lyra ERP");

                mailMessage.Subject = "Your OTP for verifiction....";

                mailMessage.Body = "Your OTP is" + OTP;

                mailMessage.IsBodyHtml = true;

                mailMessage.To.Add(new MailAddress(Session["EmailID"].ToString()));
               

                SmtpClient smtp = new SmtpClient();

                //smtp.Host = ConfigurationManager.AppSettings["Host"];
                smtp.Host = ds.Tables[0].Rows[0]["SMTPServerName"].ToString();
                
                smtp.EnableSsl = Convert.ToBoolean(ConfigurationManager.AppSettings["EnableSsl"]);

                System.Net.NetworkCredential NetworkCred = new System.Net.NetworkCredential();

                //NetworkCred.UserName = ConfigurationManager.AppSettings["UserName"]; //reading from web.config  

                //NetworkCred.Password = ConfigurationManager.AppSettings["Password"]; //reading from web.config  
                NetworkCred.UserName = ds.Tables[0].Rows[0]["SenderEmailID"].ToString();
                NetworkCred.Password = ds.Tables[0].Rows[0]["SenderEmailPwd"].ToString();

                smtp.UseDefaultCredentials = true;

                smtp.Credentials = NetworkCred;

                //smtp.Port = int.Parse(ConfigurationManager.AppSettings["Port"]); //reading from web.config  

                smtp.Port = Convert.ToInt32(ds.Tables[0].Rows[0]["SMTPServerPortNo"]);

                //smtp.Send(mailMessage);

            }

            Session["OTPTime"] = DateTime.Now;

            return View();
        }
        [HttpPost]
        public ActionResult MobileVerification(int OTP)
        {
            DateTime OTPTime = DateTime.Parse(Session["OTPTime"].ToString());
            if (OTPTime.AddMinutes(10)>DateTime.Now) {
                if (Convert.ToInt32(Session["OTP"]) == OTP)
                {

                    return RedirectToAction("Index", "Home");
                }
                else
                {
                    ViewBag.Result = "Verification Faild...";
                }
            }
            else
            {
                ViewBag.Result = "OTP Expired...";
            }


            return View();
        }

        private void UpdateUserProfile(clsUserDetails model, long id)
        {
            string user_nicename = model.user_nicename;
            string user_email = model.user_email;
            string user_status = model.user_status;
            UserProfileRepository.EditUserProfile(model, id);
        }

        [HttpPost]
        public JsonResult Update_UserProfile(clsUserDetails model)
        {
            if (ModelState.IsValid)
            {
                if (model.ID > 0)
                {
                  UpdateUserProfile(model, model.ID);
                  UpdateProfile_MetaData(model, model.ID);
                    return Json(new { status = true, message = "Profile has been saved successfully!!", url = "" }, 0);
                }

            }
            return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
        }
        [HttpPost]
        public JsonResult Update_Password(clsUserDetails model)
        {
             
                if (model.ID > 0)
                {
                     UserProfileRepository.Update_Password(model, model.ID);
                    return Json(new { status = true, message = "Password has been update successfully!!", url = "" }, 0);
                }
                else             
                     return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
        }
        private void UpdateProfile_MetaData(clsUserDetails model, long id)
        {
            string[] varQueryArr1 = new string[10];
            string[] varFieldsName = new string[10] { "nickname", "first_name", "last_name", "billing_address_1", "billing_country", "billing_phone",  "billing_address_2", "billing_city", "billing_state", "billing_postcode" };
            string[] varFieldsValue = new string[10] { model.user_nicename, model.first_name, model.last_name,model.address,model.country,model.phone, model.billing_address_2, model.billing_city, model.billing_state, model.billing_postcode };
            for (int n = 0; n < 10; n++)
            {
               UserProfileRepository.UpdateProfileMetaData(model, id, varFieldsName[n], varFieldsValue[n]);
            }
        }

        private void GetUserDetails( clsUserDetails model,long id)
        {
            
            try
            {
                DataTable DT = BAL.Users.GetDetailsUser(id);
               // DataTable DT = UserProfileRepository.DisplayProfileDetails(model,id);
                ViewBag.user_login = DT.Rows[0]["user_login"].ToString();
                ViewBag.user_email = DT.Rows[0]["user_email"].ToString();
                ViewBag.use_status = DT.Rows[0]["user_status"].ToString();
                ViewBag.first_name = DT.Rows[0]["first_name"].ToString();
                ViewBag.last_name = DT.Rows[0]["last_name"].ToString();
                ViewBag.user_phone = DT.Rows[0]["phone"].ToString();
                ViewBag.user_address = DT.Rows[0]["address"].ToString();
                ViewBag.User_Image = DT.Rows[0]["User_Image"];
                string role = DT.Rows[0]["user_role"].ToString();
                if (role == "accounting")
                    role = "Accounting";
                else if (role == "administrator")
                    role = "Administrator";
                else if (role == "author")
                    role = "Author";
                else if (role == "contributor")
                    role = "Contributor";
                else if (role == "editor")
                    role = "Editor";
                else if (role == "modsquad")
                    role = "Mod Squad";
                else if (role == "wpseo_editor")
                    role = "SEO Editor";
                else if (role == "seo_manager")
                    role = "SEO Manager";
                else if (role == "shop_manager")
                    role = "Shop Manager";
                else if (role == "shop_manager")
                    role = "Shop Manager";
                else if (role == "subscriber")
                    role = "Subscriber";
                else if (role == "supplychainmanager")
                    role = "Supply Chain Manager";
                else
                    role = role;
                ViewBag.user_role = role;
                ViewBag.user_status = DT.Rows[0]["user_status"];
                ViewBag.id = id;
                ViewBag.phone = DT.Rows[0]["phone"];
                ViewBag.State = DT.Rows[0]["State"];
                ViewBag.City = DT.Rows[0]["City"];
                ViewBag.address2 = DT.Rows[0]["address2"];
                ViewBag.postcode = DT.Rows[0]["postcode"];
            }
            catch  {
               
            }
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