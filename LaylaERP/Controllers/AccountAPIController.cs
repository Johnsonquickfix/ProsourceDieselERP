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
                    }
                    op.LoginIPAddress = Net.Ip;
                    op.LoginMacAddress = string.Empty;
                    CommanUtilities.Provider.AddCurrent(op);

                    string loginDesc = op.UserName + " Login on " + DateTime.Now.ToString("dddd, dd MMMM yyyy hh:mm tt") + ", " + Net.BrowserInfo;
                    UserActivityLog.WriteDbLog(LogType.Login, "Login", loginDesc);

                    return Json(new { status = true, message = "Login sucess", url = op.GetUrl }, 0);
                }
                else
                    return Json(new { status = false, message = "Please Check Username and Password!", url = "" }, 0);

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

        [HttpPost]
        public JsonResult getMenus(LoginModel model)
        {
            List<Dictionary<String, Object>> tableRows = new List<Dictionary<String, Object>>();
            Dictionary<String, Object> row;
            try
            {
                DataTable DT = Users.GetUserMenuAuth(model.userId.Value);
                DataRow[] rows = DT.Select("level = 0", "menu_code");
                foreach (DataRow dr in rows)
                {
                    row = new Dictionary<String, Object>();
                    row.Add("id", dr["menu_id"]);
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
            DataSet ds = Users.GetEmailCredentials();

            List<string> lstEmail = emails.Split(',').ToList();

            using (MailMessage mailMessage = new MailMessage())

            {
                mailMessage.From = new MailAddress(ds.Tables[0].Rows[0]["SenderEmailID"].ToString(), "Lyra ERP");

                mailMessage.Subject = subject;

                mailMessage.Body = content;

                mailMessage.IsBodyHtml = true;


                for (int i = 0; i < lstEmail.Count; i++)
                {
                    bool isEmail = Regex.IsMatch(lstEmail[i], @"\A(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)\Z", RegexOptions.IgnoreCase);
                    if (isEmail)
                        mailMessage.To.Add(lstEmail[i]);
                }


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
            return Json(true, 0);
        }
    }
}
