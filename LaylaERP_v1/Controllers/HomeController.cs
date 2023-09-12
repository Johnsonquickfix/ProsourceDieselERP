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
            dynamic myModel = new ExpandoObject();
            myModel.user_login = null;
            DataTable dt = BAL.SettingRepository.GetDetailscompany(3);
            myModel.User_Image = dt.Rows[0]["image"]; 
            return View(myModel);
        }
        [HttpGet]
        public ActionResult ForgotPassword()
        {
            CommanUtilities.Provider.RemoveCurrent();
            dynamic myModel = new ExpandoObject();
            myModel.user_login = null;
            DataTable dt = BAL.SettingRepository.GetDetailscompany(3);
            myModel.User_Image = dt.Rows[0]["image"];
            return View(myModel);
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
                        mailMessage.Body = @"<img src=https://erp.prosourcediesel.com/Images/prosourcediesel-logo.png /><br>" + "<p>We got a reset password request.</p> <p>Please login with a new password and change your password from your profile after logging in with a new password.</p>" + "<p>User name: " + UserName + "</p> <p>New password: " + model1.pwd +"</p>";
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
                            ViewBag.Result = "New password sent. Please check your email!";
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
                    UserActivityLog.WriteDbLog(LogType.Submit, "Reset password by " + model.UserName + "", "/Home/Index" + ", " + Net.BrowserInfo);
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

            dynamic myModel = new ExpandoObject(); 
            //DataTable dt = BAL.SettingRepository.Getentitylogo(CommanUtilities.Provider.GetCurrent().login_company_id);
            //myModel.User_Image = "/Content/Entity/" + dt.Rows[0]["logo_url"];
            //return View(myModel);
            DataTable dt = BAL.SettingRepository.GetDetailscompany(3);
            myModel.User_Image = dt.Rows[0]["image"];
            return View(myModel);

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
                ViewBag.Type = CommanUtilities.Provider.GetCurrent().UserType;
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
            DataTable dt = DashboardRepository.OrderListDashboardDetails(startDate.ToString(), endDate.ToString(), model.strValue3, model.sSearch, model.iDisplayStart, model.iDisplayLength, model.sSortColName, model.sSortDir_0);
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
        [HttpGet]
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
            SendEmail.SendEmails(CommanUtilities.Provider.GetCurrent().EmailID, "Login OTP verification.", "Login OTP is <b>" + OTPValue + "</b>");
            //Session["OTPTime"] = CommonDate.CurrentDate();

            dynamic myModel = new ExpandoObject();
            DataTable dt = BAL.SettingRepository.GetDetailscompany(3);
            myModel.User_Image = dt.Rows[0]["image"];
            return View(myModel);
            
        }        

        [HttpPost]
        public JsonResult MobileVerification(int OTP , int company_id)
        {
            string JSONresult = string.Empty, strURL = string.Empty; ; bool b_status = false;
            try
            {
                if (!string.IsNullOrEmpty(CommanUtilities.Provider.GetOTP()))
                {
                    if (CommanUtilities.Provider.GetOTP() == OTP.ToString())
                    {

                        string User_ID = CommanUtilities.Provider.GetCurrent().UserName;
                        string Password = CommanUtilities.Provider.GetCurrent().UserPassword;


                        DataSet ds = Users.VerifyUser(User_ID, Password);
                        if (ds.Tables[0].Rows.Count > 0)
                        {
                            OperatorModel op = new OperatorModel();
                            op = ds.Tables[0].AsEnumerable().Select(m => new OperatorModel
                            {
                                UserID = long.Parse(m["id"].ToString()),
                                UserName = m["user_login"].ToString(),
                                EmailID = m["user_email"].ToString(),
                                UserType = m["meta_value"].ToString(),
                                //GetUrl = m["url"].ToString(),
                            }).FirstOrDefault();
                            if (ds.Tables[0].Rows[0]["user_status"].ToString().Trim() == "1")
                                op.IsActive = true;
                            else
                                op.IsActive = false;
                            if (op.IsActive == false)
                            {
                                op.UserPassword = Password;
                                Session["UserId"] = op.UserID;
                                Session["EmailID"] = op.EmailID;
                                op.GetUrl = "home/MobileVerification";
                                if (!string.IsNullOrEmpty(op.UserType) && op.UserType.Length > 5 && op.UserType.ToString().Substring(0, 2) == "a:")
                                {
                                    if (op.UserType == "a:0:{}")
                                        op.UserType = "Unknown";
                                    else
                                        op.UserType = User_Role_Name(op.UserType); // "34444444123";  // string.Format(formatString, dt.Rows[x].ItemArray);
                                }

                                if (ds.Tables[1].Rows.Count > 0)
                                {
                                    if (ds.Tables[1].Rows[0]["AuthorizeNet"].ToString() == "1")
                                        op.AuthorizeNet = true;
                                    else
                                        op.AuthorizeNet = false;

                                    if (ds.Tables[1].Rows[0]["Paypal"].ToString() == "1")
                                        op.Paypal = true;
                                    else
                                        op.Paypal = false;

                                    if (ds.Tables[1].Rows[0]["AmazonPay"].ToString() == "1")
                                        op.AmazonPay = true;
                                    else
                                        op.AmazonPay = false;

                                    if (ds.Tables[1].Rows[0]["Podium"].ToString() == "1")
                                        op.Podium = true;
                                    else
                                        op.Podium = false;

                                    if (ds.Tables[1].Rows[0]["CreditCustomer"].ToString() == "1")
                                        op.CreditCustomer = true;
                                    else
                                        op.CreditCustomer = false;
                                    if (ds.Tables[1].Rows[0]["SenderEmailID"] != DBNull.Value)
                                        op.SenderEmailID = ds.Tables[1].Rows[0]["SenderEmailID"].ToString();
                                    else
                                        op.SenderEmailID = string.Empty;
                                    if (ds.Tables[1].Rows[0]["SenderEmailPwd"] != DBNull.Value)
                                        op.SenderEmailPwd = ds.Tables[1].Rows[0]["SenderEmailPwd"].ToString();
                                    else
                                        op.SenderEmailPwd = string.Empty;
                                    if (ds.Tables[1].Rows[0]["SMTPServerName"] != DBNull.Value)
                                        op.SMTPServerName = ds.Tables[1].Rows[0]["SMTPServerName"].ToString();
                                    else
                                        op.SMTPServerName = string.Empty;
                                    if (ds.Tables[1].Rows[0]["SMTPServerPortNo"] != DBNull.Value)
                                        op.SMTPServerPortNo = ds.Tables[1].Rows[0]["SMTPServerPortNo"].ToString();
                                    else
                                        op.SMTPServerPortNo = string.Empty;

                                    if (ds.Tables[1].Rows[0]["SSL"].ToString() == "1")
                                        op.SSL = true;
                                    else
                                        op.SSL = false;

                                    if (ds.Tables[1].Rows[0]["PaypalClientId"] != DBNull.Value)
                                        op.PaypalClientId = ds.Tables[1].Rows[0]["PaypalClientId"].ToString();
                                    else
                                        op.PaypalClientId = string.Empty;
                                    if (ds.Tables[1].Rows[0]["PaypalSecret"] != DBNull.Value)
                                        op.PaypalSecret = ds.Tables[1].Rows[0]["PaypalSecret"].ToString();
                                    else
                                        op.PaypalSecret = string.Empty;
                                    if (ds.Tables[1].Rows[0]["PaypalSellerAccount"] != DBNull.Value)
                                        op.PaypalSellerAccount = ds.Tables[1].Rows[0]["PaypalSellerAccount"].ToString();
                                    else
                                        op.PaypalSellerAccount = string.Empty;
                                    if (ds.Tables[1].Rows[0]["AuthorizeAPILogin"] != DBNull.Value)
                                        op.AuthorizeAPILogin = ds.Tables[1].Rows[0]["AuthorizeAPILogin"].ToString();
                                    else
                                        op.AuthorizeAPILogin = string.Empty;
                                    if (ds.Tables[1].Rows[0]["AuthorizeTransKey"] != DBNull.Value)
                                        op.AuthorizeTransKey = ds.Tables[1].Rows[0]["AuthorizeTransKey"].ToString();
                                    else
                                        op.AuthorizeTransKey = string.Empty;
                                    if (ds.Tables[1].Rows[0]["AuthorizeKey"] != DBNull.Value)
                                        op.AuthorizeKey = ds.Tables[1].Rows[0]["AuthorizeKey"].ToString();
                                    else
                                        op.AuthorizeKey = string.Empty;
                                    if (ds.Tables[1].Rows[0]["AmazonAPIId"] != DBNull.Value)
                                        op.AmazonAPIId = ds.Tables[1].Rows[0]["AmazonAPIId"].ToString();
                                    else
                                        op.AmazonAPIId = string.Empty;
                                    if (ds.Tables[1].Rows[0]["AmazonUser"] != DBNull.Value)
                                        op.AmazonUser = ds.Tables[1].Rows[0]["AmazonUser"].ToString();
                                    else
                                        op.AmazonUser = string.Empty;
                                    if (ds.Tables[1].Rows[0]["AmazonPwd"] != DBNull.Value)
                                        op.AmazonPwd = ds.Tables[1].Rows[0]["AmazonPwd"].ToString();
                                    else
                                        op.AmazonPwd = string.Empty;
                                    if (ds.Tables[1].Rows[0]["TaxjarAPIId"] != DBNull.Value)
                                        op.TaxjarAPIId = ds.Tables[1].Rows[0]["TaxjarAPIId"].ToString();
                                    else
                                        op.TaxjarAPIId = string.Empty;
                                    if (ds.Tables[1].Rows[0]["TaxjarUser"] != DBNull.Value)
                                        op.TaxjarUser = ds.Tables[1].Rows[0]["TaxjarUser"].ToString();
                                    else
                                        op.TaxjarUser = string.Empty;
                                    if (ds.Tables[1].Rows[0]["TaxjarPwd"] != DBNull.Value)
                                        op.TaxjarPwd = ds.Tables[1].Rows[0]["TaxjarPwd"].ToString();
                                    else
                                        op.TaxjarPwd = string.Empty;
                                    if (ds.Tables[1].Rows[0]["podiumAPIKey"] != DBNull.Value)
                                        op.podiumAPIKey = ds.Tables[1].Rows[0]["podiumAPIKey"].ToString();
                                    else
                                        op.podiumAPIKey = string.Empty;
                                    if (ds.Tables[1].Rows[0]["podiumSecretKey"] != DBNull.Value)
                                        op.podiumSecretKey = ds.Tables[1].Rows[0]["podiumSecretKey"].ToString();
                                    else
                                        op.podiumSecretKey = string.Empty;

                                    if (ds.Tables[1].Rows[0]["podium_code"] != DBNull.Value)
                                        op.podium_code = ds.Tables[1].Rows[0]["podium_code"].ToString();
                                    else
                                        op.podium_code = string.Empty;
                                    if (ds.Tables[1].Rows[0]["podium_refresh_code"] != DBNull.Value)
                                        op.podium_refresh_code = ds.Tables[1].Rows[0]["podium_refresh_code"].ToString();
                                    else
                                        op.podium_refresh_code = string.Empty;

                                }
                                // For Entity info
                                if (ds.Tables[2].Rows.Count > 0)
                                {
                                    if (ds.Tables[2].Rows[0]["CompanyName"] != DBNull.Value)
                                        op.CompanyName = ds.Tables[2].Rows[0]["CompanyName"].ToString();
                                    else
                                        op.CompanyName = string.Empty;

                                    if (ds.Tables[2].Rows[0]["firstname"] != DBNull.Value)
                                        op.firstname = ds.Tables[2].Rows[0]["firstname"].ToString();
                                    else
                                        op.firstname = string.Empty;
                                    if (ds.Tables[2].Rows[0]["lastname"] != DBNull.Value)
                                        op.lastname = ds.Tables[2].Rows[0]["lastname"].ToString();
                                    else
                                        op.lastname = string.Empty;

                                    if (ds.Tables[2].Rows[0]["address"] != DBNull.Value)
                                        op.address = ds.Tables[2].Rows[0]["address"].ToString();
                                    else
                                        op.address = string.Empty;

                                    if (ds.Tables[2].Rows[0]["address1"] != DBNull.Value)
                                        op.address1 = ds.Tables[2].Rows[0]["address1"].ToString();
                                    else
                                        op.address1 = string.Empty;

                                    if (ds.Tables[2].Rows[0]["town"] != DBNull.Value)
                                        op.City = ds.Tables[2].Rows[0]["town"].ToString();
                                    else
                                        op.City = string.Empty;

                                    if (ds.Tables[2].Rows[0]["fk_state"] != DBNull.Value)
                                        op.State = ds.Tables[2].Rows[0]["fk_state"].ToString();
                                    else
                                        op.State = string.Empty;

                                    if (ds.Tables[2].Rows[0]["fk_country"] != DBNull.Value)
                                        op.Country = ds.Tables[2].Rows[0]["fk_country"].ToString();
                                    else
                                        op.Country = string.Empty;

                                    if (ds.Tables[2].Rows[0]["zip"] != DBNull.Value)
                                        op.postal_code = ds.Tables[2].Rows[0]["zip"].ToString();
                                    else
                                        op.postal_code = string.Empty;

                                    if (ds.Tables[2].Rows[0]["country_code_phone"] != DBNull.Value)
                                        op.country_code_phone = ds.Tables[2].Rows[0]["country_code_phone"].ToString();
                                    else
                                        op.country_code_phone = string.Empty;

                                    if (ds.Tables[2].Rows[0]["phone_type"] != DBNull.Value)
                                        op.phone_type = ds.Tables[2].Rows[0]["phone_type"].ToString();
                                    else
                                        op.phone_type = string.Empty;

                                    if (ds.Tables[2].Rows[0]["user_mobile"] != DBNull.Value)
                                        op.user_mobile = ds.Tables[2].Rows[0]["user_mobile"].ToString();
                                    else
                                        op.user_mobile = string.Empty;

                                    if (ds.Tables[2].Rows[0]["email"] != DBNull.Value)
                                        op.email = ds.Tables[2].Rows[0]["email"].ToString();
                                    else
                                        op.email = string.Empty;
                                    if (ds.Tables[2].Rows[0]["logo_url"] != DBNull.Value)
                                        op.logo_url = ds.Tables[2].Rows[0]["logo_url"].ToString();
                                    else
                                        op.logo_url = string.Empty;
                                    if (ds.Tables[2].Rows[0]["website"] != DBNull.Value)
                                        op.website = ds.Tables[2].Rows[0]["website"].ToString();
                                    else
                                        op.website = string.Empty;
                                    if (ds.Tables[2].Rows[0]["additional_notes"] != DBNull.Value)
                                        op.additional_notes = ds.Tables[2].Rows[0]["additional_notes"].ToString();
                                    else
                                        op.additional_notes = string.Empty;

                                    if (ds.Tables[2].Rows[0]["po_email"] != DBNull.Value)
                                        op.po_email = ds.Tables[2].Rows[0]["po_email"].ToString();
                                    else
                                        op.po_email = string.Empty;
                                }
                                if (ds.Tables[0].Rows[0]["user_companyid"] != DBNull.Value)
                                    op.user_companyid = ds.Tables[0].Rows[0]["user_companyid"].ToString();
                                else
                                    op.user_companyid = string.Empty;
                                //op.login_company_id = company_id;
                                op.login_company_id = 1;
                                op.LoginIPAddress = Net.Ip;
                                op.LoginMacAddress = string.Empty;
                                CommanUtilities.Provider.AddCurrent(op);
                                string loginDesc = op.UserName + " Login on " + DateTime.UtcNow.ToString("dddd, dd MMMM yyyy hh:mm tt") + ", " + Net.BrowserInfo;
                                UserActivityLog.WriteDbLog(LogType.Login, "Login", loginDesc);
                                b_status = true; strURL = "/Home/Index";
                            }
                        }
                    }
                    else
                    {
                        JSONresult = "OTP verification failed...";
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

        private string User_Role_Name(string usertype)
        {
            string varUserType = string.Empty;
            if (usertype != "Administrator" && usertype != "Accounting" && usertype != "Mod Squad" && usertype != "Author" && usertype != "Shop Manager" && usertype != "Subscriber" && usertype != "Supply Chain Manager" && usertype != "SEO Editor")
            {
                if (usertype.Contains("administrator"))
                {
                    varUserType = "Administrator";
                }
                else if (usertype.Contains("accounting"))
                {
                    varUserType = "Accounting";
                }
                else if (usertype.Contains("modsquad"))
                {
                    varUserType = "Mod Squad";
                }
                else if (usertype.Contains("author"))
                {
                    varUserType = "Author";
                }
                else if (usertype.Contains("shop_manager"))
                {
                    varUserType = "Shop Manager";
                }
                else if (usertype.Contains("subscriber"))
                {
                    varUserType = "Subscriber";
                }
                else if (usertype.Contains("supplychainmanager"))
                {
                    varUserType = "Supply Chain Manager";
                }
                else if (usertype.Contains("wpseo_editor"))
                {
                    varUserType = "SEO Editor";
                }
                else
                {
                    varUserType = string.Empty;
                }
            }
            return varUserType;
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
                
                UserActivityLog.WriteDbLog(LogType.Submit, "Password updated by " + CommanUtilities.Provider.GetCurrent().UserName + "", "/Home/Index" + ", " + Net.BrowserInfo);
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
                string role = "";
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
             

                LaylaERP.UTILITIES.Serializer serializer = new LaylaERP.UTILITIES.Serializer();
                //var _att = serializer.Deserialize(dt.Rows[0]["user_role"].ToString());
                System.Collections.Hashtable _att = serializer.Deserialize(DT.Rows[0]["user_role"].ToString()) as System.Collections.Hashtable;

                foreach (System.Collections.DictionaryEntry att in _att)
                {
                    DataTable userdt = BAL.Users.Getuserclassification(att.Key.ToString());
                    role += userdt.Rows[0]["User_Type"].ToString() + ",";
                }
                if (!string.IsNullOrEmpty(role) && role.EndsWith(","))
                {
                    role = role.Substring(0, role.Length - 1);
                }



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
        public JsonResult GetSalesOrderChart(string from_date, string to_date)
        {
           DashboardRepository.GetSalesOrderChart(from_date, to_date);
            var list = DashboardRepository.exportorderlist;
            return Json(list.ToList(), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetSalesQuoteChart(string from_date, string to_date)
        {
            DashboardRepository.GetSalesQuoteChart(from_date, to_date);
            var list = DashboardRepository.QuoteList;
            return Json(list.ToList(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetQuoteDetails(string from_date, string to_date)
        {
            string result = string.Empty;
            try
            {
                DataTable ds = DashboardRepository.GetQuoteDetails(from_date, to_date);
                result = JsonConvert.SerializeObject(ds, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);

        }
        public JsonResult GetQuoteApproved(string from_date, string to_date)
        {
            string result = string.Empty;
            try
            {
                DataTable ds = DashboardRepository.GetQuoteApproved(from_date, to_date);
                result = JsonConvert.SerializeObject(ds, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);

        }
        public JsonResult GetQuoteRejected(string from_date, string to_date)
        {
            string result = string.Empty;
            try
            {
                DataTable ds = DashboardRepository.GetQuoteRejected(from_date, to_date);
                result = JsonConvert.SerializeObject(ds, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }
        public JsonResult GetQuoteRemain(string from_date, string to_date)
        {
            string result = string.Empty;
            try
            {
                DataTable ds = DashboardRepository.GetQuoteRemain(from_date, to_date);
                result = JsonConvert.SerializeObject(ds, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }
        public JsonResult GetQuoteComplete(string from_date, string to_date)
        {
            string result = string.Empty;
            try
            {
                DataTable ds = DashboardRepository.GetQuoteComplete(from_date, to_date);
                result = JsonConvert.SerializeObject(ds, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }
    }
}