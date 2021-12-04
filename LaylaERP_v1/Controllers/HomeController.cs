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
    using System.Dynamic;
    using System.Data.SqlClient;

    public class HomeController : Controller
    {
        public ActionResult Login()
        {
            Session.RemoveAll();
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
            PasswordModel model1 = new PasswordModel();

            if (!string.IsNullOrEmpty(model.UserName))
            {
                DataSet u = ForgotPasswordRepository.ForgotPassword(model.UserName);
                //DataSet ds = Users.GetEmailCredentials();
                if (u.Tables[0].Rows.Count > 0)
                {
                    Random ran = new Random();
                    model1.pwd = Convert.ToString(ran.Next());
                    string UserName = u.Tables[0].Rows[0]["user_login"].ToString();
                    string Nicename = u.Tables[0].Rows[0]["user_nicename"].ToString();
                    string Email = u.Tables[0].Rows[0]["user_email"].ToString();
                    model1.ID = Convert.ToInt32(u.Tables[0].Rows[0]["ID"]);

                    string SenderEmailID = u.Tables[1].Rows[0]["SenderEmailID"].ToString();
                    string SenderEmailPwd = u.Tables[1].Rows[0]["SenderEmailPwd"].ToString();
                    string SMTPServerPortNo = u.Tables[1].Rows[0]["SMTPServerPortNo"].ToString();
                    string SMTPServerName = u.Tables[1].Rows[0]["SMTPServerName"].ToString();
                    bool SSL = Convert.ToBoolean(u.Tables[1].Rows[0]["SSL"]);
                    string fileattach = string.Empty;

                    using (MailMessage mailMessage = new MailMessage())
                    {
                        mailMessage.From = new MailAddress(ConfigurationManager.AppSettings["UserName"], "Layla ERP");
                        mailMessage.Subject = "Reset Password";
                        mailMessage.Body = @"<img src=https://dev.laylaerp.com/Images/layla1-logo.png /><br>" + "<p>We got a reset password request.</p> <p>Please login with a new password and change your password from your profile after logging in with a new password.</p>" + "<p>User name: " + UserName + "</p> <p>New password: " + model1.pwd +"</p>";
                        mailMessage.IsBodyHtml = true;

                        /*string SenderEmailID = "david.quickfix1@gmail.com";
                        string SenderEmailPwd = "Quick!123";
                        string SMTPServerPortNo = "587";
                        string SMTPServerName = "smtp.gmail.com";
                        string fileattach = string.Empty;*/

                        //SendEmail.SendEmails(SenderEmailID.ToString(), SenderEmailPwd.ToString(), SMTPServerName.ToString(), Convert.ToInt32(SMTPServerPortNo), SSL, Email.ToString(), mailMessage.Subject,mailMessage.Body, fileattach);
                        if(model1.ID > 0)
                        {
                            SendEmail.SendEmails(SenderEmailID.ToString(), SenderEmailPwd.ToString(), SMTPServerName.ToString(), Convert.ToInt32(SMTPServerPortNo), SSL, Email.ToString(), mailMessage.Subject, mailMessage.Body, fileattach);
                            ForgotPasswordRepository.Updateuserpassword(model1);
                            ViewBag.Result = "New password sent. Please check your email !";
                        }
                        //SmtpClient smtp = new SmtpClient();

                        //smtp.Host = ds.Tables[0].Rows[0]["SMTPServerName"].ToString();

                        //smtp.EnableSsl = Convert.ToBoolean(ConfigurationManager.AppSettings["EnableSsl"]);

                        //System.Net.NetworkCredential NetworkCred = new System.Net.NetworkCredential();

                        //NetworkCred.UserName = ds.Tables[0].Rows[0]["SenderEmailID"].ToString(); //reading from web.config  

                        //NetworkCred.Password = ds.Tables[0].Rows[0]["SenderEmailPwd"].ToString(); //reading from web.config  

                        //smtp.UseDefaultCredentials = true;

                        //smtp.Credentials = NetworkCred;

                        //smtp.Port = Convert.ToInt32(ds.Tables[0].Rows[0]["SMTPServerPortNo"]); //reading from web.config  

                        //smtp.Send(mailMessage);

                    }
                    Session["UserId"] = u.Tables[0].Rows[0]["user_login"].ToString();
                    //ViewBag.Result = "Your password recovery query submitted to the administrator. Will contact you soon!!!";
                }
                else
                {
                    ViewBag.Result = "No user exist for this email id.";
                }

            }
            else
            {
                ViewBag.Result = "Please enter email id.";
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
                int res = Users.ResetPassword(model.UserName, model.PassWord);
                if (res > 0)
                {
                    return RedirectToAction("Login", "Home");
                }

            }
            return View();
        }

        public ActionResult Index(string strValue1, string strValue2)
        {
            clsUserDetails model = new clsUserDetails();

            //ViewBag.id = Session["UserId"];
            //-----------Code Start------
            //long id = 0;
            //id = ViewBag.id;
            //if (id > 0)
            //{GetUsers()
            GetUserDetails(model, CommanUtilities.Provider.GetCurrent().UserID);
            // if (!string.IsNullOrEmpty(modeldetails.strValue2))
            //GetUsersDetails(strValue1, strValue2);
            ViewBag.Type = strValue1;
            return View();
        }
        public ActionResult Dashboard(JqDataTableModel model)
        {
            try
            {
                CultureInfo us = new CultureInfo("en-US");
                DateTime startDate = DateTime.Now;
                DateTime endDate = DateTime.Now;
                if (model.DateRange2 != null)
                {
                    string[] DateRange = model.DateRange2.Split('-');
                    startDate = DateTime.Parse(DateRange[0].Trim(), us);
                    endDate = DateTime.Parse(DateRange[1].Trim(), us);
                }

                //ViewBag.totalorders = Convert.ToDecimal(BAL.DashboardRepository.Total_Orders(startDate.ToString(), endDate.ToString())).ToString("N0", us); //BAL.DashboardRepository.Total_Orders();
                //ViewBag.totalsales = Convert.ToDecimal(BAL.DashboardRepository.Total_Sales()).ToString("N2", us);
                //ViewBag.totalcustomers = Convert.ToDecimal(BAL.DashboardRepository.Total_Customer()).ToString("N0", us);
                //ViewBag.totalordercompleted = Convert.ToDecimal(BAL.DashboardRepository.Total_Order_Completed()).ToString("N0", us);
                ViewBag.TotalOrder = Convert.ToInt32(DashboardRepository.TotalOrder(startDate.ToString(), endDate.ToString()).ToString());
                if (ViewBag.TotalOrder > 10)
                    ViewBag.TotalOrder = 10;
                var sale = Convert.ToInt32(DashboardRepository.TotalSale(startDate.ToString(), endDate.ToString()).ToString());
                ViewBag.TotalSale = "$" + sale;
                ViewBag.TotalOrderCounting = Convert.ToInt32(DashboardRepository.TotalOrder(startDate.ToString(), endDate.ToString()).ToString());
            }
            catch { }
            return View();
        }

        public JsonResult GettotalOrders(JqDataTableModel model)
       {
            CultureInfo us = new CultureInfo("en-US");
            string JSONresult = string.Empty;
            try
            {
               
                string startDate = model.strValue5;
                string endDate = model.strValue6;
                JSONresult = BAL.DashboardRepository.Total_Orders(startDate, endDate).ToString();
            }
            catch { }
            return Json(new {data = Convert.ToDecimal(JSONresult).ToString("N0", us)}, 0);
        }
        public JsonResult GettotalSales(JqDataTableModel model)
        {
            CultureInfo us = new CultureInfo("en-US");
            string JSONresult = string.Empty;
            try
            {
                string startDate = model.strValue5;
                string endDate = model.strValue6;
                JSONresult = BAL.DashboardRepository.Total_Sales(startDate, endDate).ToString();

            }
            catch(Exception ex) { throw ex; }
            return Json(new { data = Convert.ToDecimal(JSONresult).ToString("N2", us) }, 0);
        }
        public JsonResult GettotalCustomer(JqDataTableModel model)
        {
            CultureInfo us = new CultureInfo("en-US");
            string JSONresult = string.Empty;
            try
            {
                string startDate = model.strValue5;
                string endDate = model.strValue6;
                JSONresult = BAL.DashboardRepository.Total_Customer(startDate, endDate).ToString();
            }
            catch(Exception ex) { throw ex; }
            return Json(new { data = Convert.ToDecimal(JSONresult).ToString("N0", us) }, 0);
        }
        public JsonResult GetcompletedOrders(JqDataTableModel model)
        {
            CultureInfo us = new CultureInfo("en-US");
            string JSONresult = string.Empty;
            try
            {
                string startDate = model.strValue5;
                string endDate = model.strValue6;
                JSONresult = BAL.DashboardRepository.Total_Order_Completed(startDate, endDate).ToString();
            }
            catch { }
            return Json(new { data = Convert.ToDecimal(JSONresult).ToString("N0", us) }, 0);
        }
        public ActionResult GetOrderList(JqDataTableModel model)
        {
            CultureInfo culture = new CultureInfo("en-US");
            string[] DateRange = model.DateRange.Split('-');

            DateTime startDate = DateTime.Parse(DateRange[0].Trim(), culture);
            DateTime endDate = DateTime.Parse(DateRange[1].Trim(), culture);

            //DataTable dt = OrderRepository.OrderListDashboard(startDate.ToString(), endDate.ToString(), model.strValue3, model.sSearch, model.iDisplayStart, model.iDisplayLength, model.sSortColName, model.sSortDir_0);
            DataTable dt = DashboardRepository.OrderListDashboard(startDate.ToString(), endDate.ToString(), model.strValue3, model.sSearch, model.iDisplayStart, model.iDisplayLength, model.sSortColName, model.sSortDir_0);
            var result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            if (dt.Rows.Count > 0)
                ViewData.Model = dt.AsEnumerable();
            else
                ViewData.Model = null;
            return PartialView("OrderList", ViewData.Model);
        }

        public ActionResult GetUsers()
        {
            dynamic mymodel = new ExpandoObject();
            DataTable dtusers = DashboardRepository.GetUsers();

            DataTable dtcustmer = DashboardRepository.GetCustomer();
            DataTable dtorder = DashboardRepository.Getorder();
            var resultusers = JsonConvert.SerializeObject(dtusers, Formatting.Indented);
            var resulcustmer = JsonConvert.SerializeObject(dtcustmer, Formatting.Indented);
            var resultorder = JsonConvert.SerializeObject(dtorder, Formatting.Indented);
            mymodel.Users = dtusers.AsEnumerable();
            mymodel.Customer = dtcustmer.AsEnumerable();
            mymodel.order = dtorder.AsEnumerable();
            return View(mymodel);
        }
        [HttpPost]
        public JsonResult GetUsersDetails(SearchModel model)
        {
            string result = string.Empty;
            try
            {
                DataSet ds = DashboardRepository.GetCommonSearch(model.strValue1, model.strValue2);
                result = JsonConvert.SerializeObject(ds, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);

            //dynamic mymodel = new ExpandoObject();
            //mymodel.Users = null;
            //mymodel.Customer = null;
            //mymodel.order = null;
            //if (!string.IsNullOrEmpty(model.strValue2))
            //{
            //    if (model.strValue1 == "users")
            //    {
            //        DataTable dtusers = DashboardRepository.GetUsersDetails(model.strValue2);
            //        var resultusers = JsonConvert.SerializeObject(dtusers, Formatting.Indented);
            //        mymodel.Users = dtusers.AsEnumerable();
            //        DataTable dtcustmer = DashboardRepository.GetCustomer();
            //        DataTable dtorder = DashboardRepository.Getorder();
            //        var resulcustmer = JsonConvert.SerializeObject(dtcustmer, Formatting.Indented);
            //        var resultorder = JsonConvert.SerializeObject(dtorder, Formatting.Indented);
            //        mymodel.Customer = dtcustmer.AsEnumerable();
            //        mymodel.order = dtorder.AsEnumerable();
            //    }
            //    else if (model.strValue1 == "customers")
            //    {
            //        DataTable dtcustmer = DashboardRepository.GetCustomerDetails(model.strValue2);
            //        var resulcustmer = JsonConvert.SerializeObject(dtcustmer, Formatting.Indented);
            //        mymodel.Customer = dtcustmer.AsEnumerable();
            //        DataTable dtusers = DashboardRepository.GetUsers();
            //        DataTable dtorder = DashboardRepository.Getorder();
            //        var resultusers = JsonConvert.SerializeObject(dtusers, Formatting.Indented);
            //        var resultorder = JsonConvert.SerializeObject(dtorder, Formatting.Indented);
            //        mymodel.Users = dtusers.AsEnumerable();
            //        mymodel.order = dtorder.AsEnumerable();

            //    }
            //    else
            //    {
            //        DataTable dtorder = DashboardRepository.GetorderDetails(model.strValue2);
            //        var resultorder = JsonConvert.SerializeObject(dtorder, Formatting.Indented);
            //        mymodel.order = dtorder.AsEnumerable();
            //        DataTable dtusers = DashboardRepository.GetUsers();
            //        DataTable dtcustmer = DashboardRepository.GetCustomer();
            //        var resultusers = JsonConvert.SerializeObject(dtusers, Formatting.Indented);
            //        var resulcustmer = JsonConvert.SerializeObject(dtcustmer, Formatting.Indented);
            //        mymodel.Users = dtusers.AsEnumerable();
            //        mymodel.Customer = dtcustmer.AsEnumerable();
            //    }
            //}
            //else
            //{
            //    DataTable dtusers = DashboardRepository.GetUsers();
            //    DataTable dtcustmer = DashboardRepository.GetCustomer();
            //    DataTable dtorder = DashboardRepository.Getorder();
            //    var resultusers = JsonConvert.SerializeObject(dtusers, Formatting.Indented);
            //    var resulcustmer = JsonConvert.SerializeObject(dtcustmer, Formatting.Indented);
            //    var resultorder = JsonConvert.SerializeObject(dtorder, Formatting.Indented);
            //    mymodel.Users = dtusers.AsEnumerable();
            //    mymodel.Customer = dtcustmer.AsEnumerable();
            //    mymodel.order = dtorder.AsEnumerable();
            //}
            //return View(mymodel);            
        }


        public ActionResult Gettotal(JqDataTableModel model)
        {
            DateTime startDate = DateTime.Now;
            DateTime endDate = DateTime.Now;
            if (model.strValue1 == null)
                model.strValue1 = "daily";
            if (model.strValue1 == "daily")
            {
                startDate = DateTime.Now;
                endDate = DateTime.Now;
            }
            else
            {
                DateTime date = DateTime.Now.AddDays(-7);
                while (date.DayOfWeek != DayOfWeek.Monday)
                {
                    date = date.AddDays(-1);
                }

                startDate = date;
                endDate = date.AddDays(7);
            }
            ViewBag.TotalOrder = Convert.ToInt32(DashboardRepository.TotalOrder(startDate.ToString(), endDate.ToString()).ToString());
            if (ViewBag.TotalOrder > 10)
                ViewBag.TotalOrder = 10;
            ViewBag.TotalSale = Convert.ToInt32(DashboardRepository.TotalSale(startDate.ToString(), endDate.ToString()).ToString());
            ViewBag.TotalOrderCounting = Convert.ToInt32(DashboardRepository.TotalOrder(startDate.ToString(), endDate.ToString()).ToString());

            // ViewBag.modsquad = Convert.ToInt32(DashboardRepository.RoleCount(1).ToString());

            return View();
        }

        public JsonResult GettotalDetsils(JqDataTableModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                dynamic dynamicModel = new ExpandoObject();
                CultureInfo culture = new CultureInfo("en-US");
                DateTime startDate = DateTime.Parse(model.strValue5, culture);
                DateTime endDate = DateTime.Parse(model.strValue6, culture);

                DataTable dt = DashboardRepository.Gettotal(startDate.ToString(), endDate.ToString());
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public ActionResult MobileVerification()
        {
            Random _rdm = new Random();
            int OTPValue = _rdm.Next(1000, 9999);
            CommanUtilities.Provider.AddOTP(OTPValue);
            ViewBag.otp = OTPValue;
            //SendEmail.SendEmails(CommanUtilities.Provider.GetCurrent().EmailID, "Your OTP for verifiction....", "Your OTP is <b>" + OTP + "</b>");
            //Session["OTPTime"] = CommonDate.CurrentDate();
            return View();
        }

        [HttpPost]
        public JsonResult MobileVerification(int OTP)
        {
            string JSONresult = string.Empty, strURL = string.Empty; ; bool b_status = false;
            try
            {
                if (!string.IsNullOrEmpty(CommanUtilities.Provider.GetOTP()))
                {
                    if (CommanUtilities.Provider.GetOTP() == OTP.ToString())
                    {
                        b_status = true; strURL = "/Home/Index";
                        //return RedirectToAction("Index", "Home");
                    }
                    else
                    {
                        JSONresult = "Verification Faild...";
                    }
                }
                else
                {
                    JSONresult = "OTP Expired...";
                }
            }
            catch { JSONresult = "OTP Expired..."; b_status = false; }
            return Json(new { status = b_status, message = JSONresult, url = strURL }, 0);
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
                    return Json(new { status = true, message = "Profile saved successfully!!", url = "" }, 0);
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
                return Json(new { status = true, message = "Password updated successfully!!", url = "" }, 0);
            }
            else
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
        }
        private void UpdateProfile_MetaData(clsUserDetails model, long id)
        {
            if (string.IsNullOrEmpty(model.billing_address_2))
                model.billing_address_2 = "";
            string[] varQueryArr1 = new string[10];
            string[] varFieldsName = new string[10] { "nickname", "first_name", "last_name", "billing_address_1", "billing_country", "billing_phone", "billing_address_2", "billing_city", "billing_state", "billing_postcode" };
            string[] varFieldsValue = new string[10] { model.user_nicename, model.first_name, model.last_name, model.address, model.country, model.phone, model.billing_address_2, model.billing_city, model.billing_state, model.billing_postcode };
            for (int n = 0; n < 10; n++)
            {
                UserProfileRepository.UpdateProfileMetaData(model, id, varFieldsName[n], varFieldsValue[n]);
            }
        }

        private void GetUserDetails(clsUserDetails model, long id)
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
                string role = DT.Rows[0]["roletype"].ToString();
                //if (role == "accounting")
                //    role = "Accounting";
                //else if (role == "administrator")
                //    role = "Administrator";
                //else if (role == "author")
                //    role = "Author";
                //else if (role == "contributor")
                //    role = "Contributor";
                //else if (role == "editor")
                //    role = "Editor";
                //else if (role == "modsquad")
                //    role = "Mod Squad";
                //else if (role == "wpseo_editor")
                //    role = "SEO Editor";
                //else if (role == "seo_manager")
                //    role = "SEO Manager";
                //else if (role == "shop_manager")
                //    role = "Shop Manager";
                //else if (role == "shop_manager")
                //    role = "Shop Manager";
                //else if (role == "subscriber")
                //    role = "Subscriber";
                //else if (role == "supplychainmanager")
                //    role = "Supply Chain Manager";
                //else
                //    role = role;
                ViewBag.user_role = role;
                ViewBag.user_status = DT.Rows[0]["user_status"];
                ViewBag.id = id;
                ViewBag.phone = DT.Rows[0]["phone"];
                ViewBag.State = DT.Rows[0]["State"];
                ViewBag.City = DT.Rows[0]["City"];
                ViewBag.address2 = DT.Rows[0]["address2"];
                ViewBag.postcode = DT.Rows[0]["postcode"];
                ViewBag.country = DT.Rows[0]["country"];
            }
            catch
            {

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

        // Sales graph 
        [HttpPost]
        public JsonResult SalesGraph(JqDataTableModel model)
        {
            try
            {
                string startDate = model.strValue5;
                string endDate = model.strValue6;
                DashboardRepository.SalesGraph1(startDate, endDate);
                return Json(DashboardRepository.chartData);
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }
    }
}