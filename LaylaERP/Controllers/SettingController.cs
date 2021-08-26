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
                DataSet DT = SettingRepository.DisplaySettings();
                ViewBag.AuthorizeNet = DT.Tables[0].Rows[0]["AuthorizeNet"].ToString();
                
                ViewBag.id = DT.Tables[0].Rows[0]["ID"].ToString();
                ViewBag.Paypal = DT.Tables[0].Rows[0]["Paypal"].ToString();
                ViewBag.AmazonPay = DT.Tables[0].Rows[0]["AmazonPay"].ToString();
                ViewBag.CreditCustomer = DT.Tables[0].Rows[0]["CreditCustomer"].ToString();
                ViewBag.Podium = DT.Tables[0].Rows[0]["Podium"].ToString();
                ViewBag.SenderEmailID = DT.Tables[0].Rows[0]["SenderEmailID"].ToString();
                ViewBag.SenderEmailPwd = DT.Tables[0].Rows[0]["SenderEmailPwd"].ToString();
                ViewBag.SMTPServerName = DT.Tables[0].Rows[0]["SMTPServerName"].ToString();
                ViewBag.SMTPServerPortNo = DT.Tables[0].Rows[0]["SMTPServerPortNo"].ToString();
                ViewBag.PaypalClientId = DT.Tables[0].Rows[0]["PaypalClientId"].ToString();
                ViewBag.PaypalSecret = DT.Tables[0].Rows[0]["PaypalSecret"].ToString();
                ViewBag.PaypalSellerAccount = DT.Tables[0].Rows[0]["PaypalSellerAccount"].ToString();
                ViewBag.AuthorizeAPILogin = DT.Tables[0].Rows[0]["AuthorizeAPILogin"].ToString();
                ViewBag.AuthorizeTransKey = DT.Tables[0].Rows[0]["AuthorizeTransKey"].ToString();
                ViewBag.AuthorizeKey = DT.Tables[0].Rows[0]["AuthorizeKey"].ToString();
                ViewBag.AmazonAPIId = DT.Tables[0].Rows[0]["AmazonAPIId"].ToString();
                ViewBag.AmazonUser = DT.Tables[0].Rows[0]["AmazonUser"].ToString();
                ViewBag.AmazonPwd = DT.Tables[0].Rows[0]["AmazonPwd"].ToString();
                ViewBag.TaxjarAPIId = DT.Tables[0].Rows[0]["TaxjarAPIId"].ToString();
                ViewBag.TaxjarUser = DT.Tables[0].Rows[0]["TaxjarUser"].ToString();
                ViewBag.TaxjarPwd = DT.Tables[0].Rows[0]["TaxjarPwd"].ToString();
                ViewBag.podiumAPIKey = DT.Tables[0].Rows[0]["podiumAPIKey"].ToString();
                ViewBag.podiumSecretKey = DT.Tables[0].Rows[0]["podiumSecretKey"].ToString();
                //ds.Tables[1].Rows[0]["podiumSecretKey"].ToString();
                ViewBag.CompanyName = DT.Tables[1].Rows[0]["CompanyName"].ToString();
                ViewBag.lastname = DT.Tables[1].Rows[0]["lastname"].ToString();
                ViewBag.firstname = DT.Tables[1].Rows[0]["firstname"].ToString();
                ViewBag.address = DT.Tables[1].Rows[0]["address"].ToString();
                ViewBag.address1 = DT.Tables[1].Rows[0]["address1"].ToString();
                ViewBag.zip = DT.Tables[1].Rows[0]["zip"].ToString();
                ViewBag.town = DT.Tables[1].Rows[0]["town"].ToString();
                ViewBag.fk_state = DT.Tables[1].Rows[0]["fk_state"].ToString();
                ViewBag.fk_country = DT.Tables[1].Rows[0]["fk_country"].ToString();
                ViewBag.country_code_phone = DT.Tables[1].Rows[0]["country_code_phone"].ToString();
                ViewBag.user_mobile = DT.Tables[1].Rows[0]["user_mobile"].ToString();
                ViewBag.email = DT.Tables[1].Rows[0]["email"].ToString();
                ViewBag.website = DT.Tables[1].Rows[0]["website"].ToString();
                ViewBag.logo_url = DT.Tables[1].Rows[0]["logo_url"].ToString();
                ViewBag.additional_notes = DT.Tables[1].Rows[0]["additional_notes"].ToString();

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
        private void Update_EntityInfo(SettingModel model, long id)
        {
            SettingRepository.Update_EntityInfo(model, id);
        }

        [HttpPost]
        public JsonResult settingdone(SettingModel model)
        {
            if (ModelState.IsValid)
            {
                if (model.ID > 0)
                {
                    Update_Setting(model, model.ID);
                    Update_EntityInfo(model, model.ID);
                    return Json(new { status = true, message = "Setting has been saved successfully please login again!!", url = "" }, 0);
                }
                
            }
            return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
        }

        //Code for setting end
    }
}