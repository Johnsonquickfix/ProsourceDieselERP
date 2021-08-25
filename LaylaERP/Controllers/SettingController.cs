using LaylaERP.BAL;
using LaylaERP.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LaylaERP.Controllers
{
    public class SettingController : Controller
    {
        //SettingRepository Repo = null;
        // GET: Setting
        public ActionResult Setting(SettingModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable DT = SettingRepository.DisplaySettings();
                ViewBag.AuthorizeNet = DT.Rows[0]["AuthorizeNet"].ToString();
                
                ViewBag.id = DT.Rows[0]["ID"].ToString();
                ViewBag.Paypal = DT.Rows[0]["Paypal"].ToString();
                ViewBag.AmazonPay = DT.Rows[0]["AmazonPay"].ToString();
                ViewBag.CreditCustomer = DT.Rows[0]["CreditCustomer"].ToString();
                ViewBag.Podium = DT.Rows[0]["Podium"].ToString();
                ViewBag.SenderEmailID = DT.Rows[0]["SenderEmailID"].ToString();
                ViewBag.SenderEmailPwd = DT.Rows[0]["SenderEmailPwd"].ToString();
                ViewBag.SMTPServerName = DT.Rows[0]["SMTPServerName"].ToString();
                ViewBag.SMTPServerPortNo = DT.Rows[0]["SMTPServerPortNo"].ToString();
                ViewBag.PaypalClientId = DT.Rows[0]["PaypalClientId"].ToString();
                ViewBag.PaypalSecret = DT.Rows[0]["PaypalSecret"].ToString();
                ViewBag.PaypalSellerAccount = DT.Rows[0]["PaypalSellerAccount"].ToString();
                ViewBag.AuthorizeAPILogin = DT.Rows[0]["AuthorizeAPILogin"].ToString();
                ViewBag.AuthorizeTransKey = DT.Rows[0]["AuthorizeTransKey"].ToString();
                ViewBag.AuthorizeKey = DT.Rows[0]["AuthorizeKey"].ToString();
                ViewBag.AmazonAPIId = DT.Rows[0]["AmazonAPIId"].ToString();
                ViewBag.AmazonUser = DT.Rows[0]["AmazonUser"].ToString();
                ViewBag.AmazonPwd = DT.Rows[0]["AmazonPwd"].ToString();
                ViewBag.TaxjarAPIId = DT.Rows[0]["TaxjarAPIId"].ToString();
                ViewBag.TaxjarUser = DT.Rows[0]["TaxjarUser"].ToString();
                ViewBag.TaxjarPwd = DT.Rows[0]["TaxjarPwd"].ToString();
                ViewBag.podiumAPIKey = DT.Rows[0]["podiumAPIKey"].ToString();
                ViewBag.podiumSecretKey = DT.Rows[0]["podiumSecretKey"].ToString();

            }
            catch { }
            return View();
        }
        // GET: Activity Log History
        public ActionResult ActivityLog()
        {
            return View();
        }

        [HttpPost]
        public JsonResult GetUserList(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable DT = Users.GetUsers(model.strValue1);
                JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        [HttpPost]
        public JsonResult GetActivityLogList(SearchModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                long urid = 0; 
                 DateTime fromdate = DateTime.Now, todate = DateTime.Now;
                if (!string.IsNullOrEmpty(model.strValue1))
                    urid = Convert.ToInt64(model.strValue1);
                if (!string.IsNullOrEmpty(model.strValue2))
                    fromdate = Convert.ToDateTime(model.strValue2);
                if (!string.IsNullOrEmpty(model.strValue3))
                    todate = Convert.ToDateTime(model.strValue3);
                DataTable dt = UTILITIES.UserActivityLog.GetActivityLog(urid, fromdate, todate, model.PageNo, model.PageSize, out TotalRecord);
                result = JsonConvert.SerializeObject(dt);
            }
            catch { }
            //return Json(JSONresult, 0);
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }

        //Code for setting start
        private void Update_Setting(SettingModel model, long id)
        {
            bool AuthorizeNet = model.AuthorizeNet;
            bool Paypal = model.Paypal;
            bool AmazonPay = model.AmazonPay;
            bool CreditCustomer = model.CreditCustomer;
            bool Podium = model.Podium;
            string email = model.SenderEmailID;
            string SenderEmailPwd = model.SenderEmailPwd;
            string SMTPServerName = model.SMTPServerName;
            string SMTPServerPortNo = Convert.ToInt32(model.SMTPServerPortNo).ToString();
            string PaypalClientId = model.PaypalClientId;
            string PaypalSecret = model.PaypalSecret;
            string PaypalSellerAccount = model.PaypalSellerAccount;
            string PaypalAccountDetails = model.PaypalAccountDetails;
            string AuthorizeAPILogin = model.AuthorizeAPILogin;
            string AuthorizeTransKey = model.AuthorizeTransKey;
            string AuthorizeKey = model.AuthorizeKey;
            string AmazonAPIId = model.AmazonAPIId;
            string AmazonUser = model.AmazonUser;
            string AmazonPwd = model.AmazonPwd;
            string TaxjarAPIId = model.TaxjarAPIId;
            string TaxjarUser = model.TaxjarUser;
            string TaxjarPwd = model.TaxjarPwd;
            string podiumAPIKey = model.podiumAPIKey;
            string podiumSecretKey = model.podiumSecretKey;
            SettingRepository.Updatesetting(model, id,email);
            
        }

        [HttpPost]
        public JsonResult settingdone(SettingModel model)
        {
            if (ModelState.IsValid)
            {
                if (model.ID > 0)
                {
                    Update_Setting(model, model.ID);
                    return Json(new { status = true, message = "Setting has been saved successfully please login again!!", url = "" }, 0);
                }
                
            }
            return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
        }

        //Code for setting end
    }
}