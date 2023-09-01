namespace LaylaERP.Controllers
{
    using BAL;
    using Models;
    using UTILITIES;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web.Mvc;
    using System.Data;
    using System.Net.Mail;
    using System.Configuration;
    using System.Text.RegularExpressions;
    using Newtonsoft.Json;

    public class AccountAPIController : Controller
    {
        [HttpPost]
        public JsonResult Login(LoginModel model)
        {
            if (ModelState.IsValid)
            {
                DataSet ds = Users.VerifyUser(model.UserName, model.PassWord);
                if (ds.Tables[0].Rows.Count > 0)
                {
                    OperatorModel op = new OperatorModel();
                    if (ds.Tables[0].Rows[0]["user_companyid"] != DBNull.Value)
                        op.user_companyid = ds.Tables[0].Rows[0]["user_companyid"].ToString();
                    else
                        op.user_companyid = string.Empty;
                    if (ds.Tables[0].Rows[0]["user_status"].ToString().Trim() == "1")
                        op.IsActive = true;
                    else
                        op.IsActive = false;
                    if (op.IsActive == false)
                    {
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
                        op.UserName = model.UserName;
                        op.UserPassword = model.PassWord; 
                        op.GetUrl = "home/MobileVerification";
                        op.public_api_key = "1970a998d9bd";// Add for Klaviyo clone API
                        CommanUtilities.Provider.AddCurrent(op); 
                       // string loginDesc = op.UserName + " Login on " + DateTime.UtcNow.ToString("dddd, dd MMMM yyyy hh:mm tt") + ", " + Net.BrowserInfo;
                        //UserActivityLog.WriteDbLog(LogType.Login, "Login", loginDesc);

                        return Json(new { status = true, message = "Login sucess", url = op.GetUrl }, 0);
                    }
                    else
                        return Json(new { status = false, message = "Please contact to your administrator", url = "" }, 0);
                }
                else
                    return Json(new { status = false, message = "Please check username or password!", url = "" }, 0);

            }
            return Json(new { status = false, message = "Invalid User", url = "" }, 0);
        }
        [HttpPost]
        public JsonResult Login_Old(LoginModel model)
        {
            if (ModelState.IsValid)
            {
                DataSet ds = Users.VerifyUser(model.UserName, model.PassWord);
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
                        op.UserPassword = model.PassWord;
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
                            op.LoginIPAddress = Net.Ip;
                        op.LoginMacAddress = string.Empty;
                        CommanUtilities.Provider.AddCurrent(op);

                        string loginDesc = op.UserName + " Login on " + DateTime.UtcNow.ToString("dddd, dd MMMM yyyy hh:mm tt") + ", " + Net.BrowserInfo;
                        UserActivityLog.WriteDbLog(LogType.Login, "Login", loginDesc);

                        return Json(new { status = true, message = "Login sucess", url = op.GetUrl }, 0);
                    }
                    else
                        return Json(new { status = false, message = "Please contact to your administrator", url = "" }, 0);
                }
                else
                    return Json(new { status = false, message = "Please check username or password!", url = "" }, 0);

            }
            return Json(new { status = false, message = "Invalid User", url = "" }, 0);
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

        //[HttpPost]
        //public JsonResult getMenus(LoginModel model)
        //{
        //    List<Dictionary<String, Object>> tableRows = new List<Dictionary<String, Object>>();
        //    Dictionary<String, Object> row;
        //    try
        //    {
        //        DataTable DT = Users.GetUserMenuAuth(CommanUtilities.Provider.GetCurrent().UserID);
        //        DataRow[] rows = DT.Select("level = 0", "menu_code");
        //        foreach (DataRow dr in rows)
        //        {
        //            row = new Dictionary<String, Object>();
        //            row.Add("id", dr["menu_id"]);
        //            row.Add("text", dr["menu_name"]);
        //            if (dr["menu_url"].ToString().Trim() != "#")
        //                row.Add("url", dr["menu_url"]);
        //            row.Add("urlType", "none");
        //            row.Add("targetType", "iframe-tab");
        //            row.Add("level", dr["level"]);
        //            row.Add("icon", dr["menu_icon"]);
        //            if (dr["parent_id"] != DBNull.Value)
        //                row.Add("parent", dr["parent_id"]);
        //            List<Dictionary<string, object>> list2 = Getdata(DT, Convert.ToInt32(dr["menu_id"]));
        //            row.Add("children", list2);
        //            tableRows.Add(row);
        //        }
        //    }
        //    catch (Exception ex) { throw ex; }
        //    return Json(tableRows, 0);
        //}
        [HttpPost]
        public JsonResult getMenus(LoginModel model)
        {
            List<Dictionary<String, Object>> tableRows = new List<Dictionary<String, Object>>();
            Dictionary<String, Object> row;
            try

            {
                DataTable DT = Users.GetUserMenuAuth(CommanUtilities.Provider.GetCurrent().UserType);
                //DataTable DT = Users.GetUserAuth(model.userId.Value);
                DataRow[] rows = DT.Select("level = 0", "menu_code");
                foreach (DataRow dr in rows)
                {
                    row = new Dictionary<String, Object>();
                    row.Add("id", dr["menu_id"]);
                    row.Add("add", dr["add_"]);
                    row.Add("edit", dr["edit_"]);
                    row.Add("delete", dr["delete_"]);
                    row.Add("text", dr["menu_name"]);
                    if (dr["menu_url"].ToString().Trim() != "#")
                        row.Add("url", dr["menu_url"]);

                    row.Add("urlType", "none");
                    row.Add("targetType", "iframe-tab");
                    row.Add("level", dr["level"]);
                    row.Add("icon", dr["menu_icon"]);
                    if (dr["parent_id"] != DBNull.Value)
                        row.Add("parent", dr["parent_id"]);
                    List<Dictionary<string, object>> list2 = Getdata(DT, Convert.ToInt32(dr["menu_id"]));
                    row.Add("children", list2);
                    tableRows.Add(row);
                }
            }
            catch { }
            return Json(tableRows, 0);
        }
        public static List<Dictionary<string, object>> Getdata(DataTable DT, int ParentID)
        {
            List<Dictionary<string, object>> list = new List<Dictionary<string, object>>();
            Dictionary<String, Object> row;
            DataRow[] rows = DT.Select("parent_id = " + ParentID.ToString(), "menu_code");
            foreach (DataRow dr in rows)
            {
                row = new Dictionary<String, Object>();
                row.Add("id", dr["menu_id"]);
                row.Add("add", dr["add_"]);
                row.Add("edit", dr["edit_"]);
                row.Add("delete", dr["delete_"]);
                row.Add("text", dr["menu_name"]);
                if (dr["menu_url"].ToString().Trim() != "#")
                    row.Add("url", dr["menu_url"]);
                row.Add("urlType", "none");
                row.Add("targetType", "iframe-tab");
                row.Add("level", dr["level"]);
                row.Add("icon", dr["menu_icon"]);
                if (dr["parent_id"] != DBNull.Value)
                    row.Add("parent", dr["parent_id"]);
                List<Dictionary<string, object>> list2 = Getdata(DT, Convert.ToInt32(dr["menu_id"]));
                row.Add("children", list2);
                list.Add(row);
            }
            return list;
        }

        [HttpPost]
        public JsonResult getMenusdata(LoginModel model)
        {
            List<Dictionary<String, Object>> tableRows = new List<Dictionary<String, Object>>();
            Dictionary<String, Object> row;
            try

            {
                DataTable DT = Users.GetUsersMenuAuth(CommanUtilities.Provider.GetCurrent().UserType);
                //DataTable DT = Users.GetUserAuth(model.userId.Value);
                DataRow[] rows = DT.Select("level = 0", "menu_code");
                foreach (DataRow dr in rows)
                {
                    row = new Dictionary<String, Object>();
                    row.Add("id", dr["menu_id"]);
                    //row.Add("add", dr["add_"]);
                    //row.Add("edit", dr["edit_"]);
                    //row.Add("delete", dr["delete_"]);
                    row.Add("text", dr["menu_name"]);
                    if (dr["menu_url"].ToString().Trim() != "#")
                        row.Add("url", dr["menu_url"]);

                    row.Add("urlType", "none");
                    row.Add("targetType", "iframe-tab");
                    row.Add("level", dr["level"]);
                    row.Add("icon", dr["menu_icon"]);
                    if (dr["parent_id"] != DBNull.Value)
                        row.Add("parent", dr["parent_id"]);
                    List<Dictionary<string, object>> list2 = Getdetails(DT, Convert.ToInt32(dr["menu_id"]));
                    row.Add("children", list2);
                    tableRows.Add(row);
                }
            }
            catch { }
            return Json(tableRows, 0);
        }
        public static List<Dictionary<string, object>> Getdetails(DataTable DT, int ParentID)
        {
            List<Dictionary<string, object>> list = new List<Dictionary<string, object>>();
            Dictionary<String, Object> row;
            DataRow[] rows = DT.Select("parent_id = " + ParentID.ToString(), "menu_code");
            foreach (DataRow dr in rows)
            {
                row = new Dictionary<String, Object>();
                row.Add("id", dr["menu_id"]);
                //row.Add("add", dr["add_"]);
                //row.Add("edit", dr["edit_"]);
                //row.Add("delete", dr["delete_"]);
                row.Add("text", dr["menu_name"]);
                if (dr["menu_url"].ToString().Trim() != "#")
                    row.Add("url", dr["menu_url"]);
                row.Add("urlType", "none");
                row.Add("targetType", "iframe-tab");
                row.Add("level", dr["level"]);
                row.Add("icon", dr["menu_icon"]);
                if (dr["parent_id"] != DBNull.Value)
                    row.Add("parent", dr["parent_id"]);
                List<Dictionary<string, object>> list2 = Getdetails(DT, Convert.ToInt32(dr["menu_id"]));
                row.Add("children", list2);
                list.Add(row);
            }
            return list;
        }


        public JsonResult getUserPermissions(LoginModel model)
        {
            string result = string.Empty;
            try
            {
                DataTable dt = Users.GetPermissions(CommanUtilities.Provider.GetCurrent().UserType, model.menu_url);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }

        [HttpPost]
        public JsonResult menuWriteDbLog(ActivityLogModel model)
        {
            string strmsg = "Log done";
            try
            {
                UserActivityLog.WriteDbLog(LogType.Visit, model.ModuleName, model.ModuleURL + ", " + Net.BrowserInfo);
            }
            catch (Exception ex)
            {
                return Json(new { message = ex.Message }, 0);
            }
            return Json(new { message = strmsg }, 0);
        }

        [HttpPost]
        public ActionResult QuicksendEmail(string emails, string subject, string content)
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

                SendEmail.SendEmails(emails, subject, content);
                result = true;
            }
            catch { result = false; }
            return Json(result, 0);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        //[ValidateGoogleCaptcha]
        public ActionResult ContactUs(string name, string email, string subject, string content)
        {
            string SenderEmailID = string.Empty, SenderEmailPwd = string.Empty, SMTPServerName = string.Empty;
            int SMTPServerPortNo = 587; bool SSL = false;

            DataSet ds = Users.GetEmailCredentials();

            SenderEmailID = ds.Tables[0].Rows[0]["SenderEmailID"].ToString();
            SenderEmailPwd = ds.Tables[0].Rows[0]["SenderEmailPwd"].ToString();
            List<string> lstEmail = email.Split(',').ToList();

            using (MailMessage mailMessage = new MailMessage())
            {
                mailMessage.From = new MailAddress(email); // new MailAddress(ConfigurationManager.AppSettings["UserName"], "Layla ERP");
                mailMessage.Subject = subject;
                mailMessage.Body = content;
                mailMessage.IsBodyHtml = true;
                mailMessage.To.Add(new MailAddress(SenderEmailID));

                SmtpClient smtp = new SmtpClient();
                smtp.Host = ds.Tables[0].Rows[0]["SMTPServerName"].ToString();
                smtp.EnableSsl = SSL; //Convert.ToBoolean(ConfigurationManager.AppSettings["EnableSsl"]);
                System.Net.NetworkCredential NetworkCred = new System.Net.NetworkCredential();
                NetworkCred.UserName = SenderEmailID.Trim();// ds.Tables[0].Rows[0]["SenderEmailID"].ToString(); //reading from web.config  
                NetworkCred.Password = SenderEmailPwd.Trim();// ds.Tables[0].Rows[0]["SenderEmailPwd"].ToString(); //reading from web.config  
                smtp.UseDefaultCredentials = true;
                smtp.Credentials = NetworkCred;
                smtp.Port = SMTPServerPortNo; //Convert.ToInt32(ds.Tables[0].Rows[0]["SMTPServerPortNo"]); //reading from web.config  
                smtp.Send(mailMessage);
            }
            return Json(new { status = true, message = "Email send successfully! Contact you soon.", url = "" }, 0);
            //return Json(true,0);
        }
    }
}
