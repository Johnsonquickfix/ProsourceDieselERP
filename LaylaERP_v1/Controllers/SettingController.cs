using LaylaERP.BAL;
using LaylaERP.Models;
using LaylaERP.UTILITIES;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Dynamic;
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
                ViewBag.SSL = DT.Tables[0].Rows[0]["SSL"].ToString();
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
                ViewBag.podium_code = DT.Tables[0].Rows[0]["podium_code"].ToString();
                ViewBag.podium_refresh_code = DT.Tables[0].Rows[0]["podium_refresh_code"].ToString();
                ViewBag.podium_locationuid = DT.Tables[0].Rows[0]["podium_locationuid"].ToString();
                ViewBag.affirm_api_key = DT.Tables[0].Rows[0]["affirm_api_key"].ToString();
                ViewBag.affirm_private_api_key = DT.Tables[0].Rows[0]["affirm_private_api_key"].ToString();
                ViewBag.amazon_public_key = DT.Tables[0].Rows[0]["amazon_public_key"].ToString();
                ViewBag.amazon_private_key = DT.Tables[0].Rows[0]["amazon_private_key"].ToString();

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
                ViewBag.po_email = DT.Tables[1].Rows[0]["po_email"].ToString();
                ViewBag.base_url = DT.Tables[1].Rows[0]["base_url"].ToString();

            }
            catch { }
            return View();
        }
        // GET: Activity Log History
        public ActionResult ActivityLog()
        {
            return View();
        }
        public ActionResult CompanyInfo()
        {
            dynamic myModel = new ExpandoObject();
             myModel.user_status = null;
             myModel.first_name = null;
            myModel.last_name = null; 
            myModel.User_Image = null;
            myModel.user_email = null;
            myModel.phone = null;
            myModel.ID = null; 
            //myModel.user_email = null;
            DataTable dt = BAL.SettingRepository.GetDetailscompany(3); 
            myModel.User_Image = dt.Rows[0]["image"];
            myModel.email = dt.Rows[0]["email"];
            myModel.user_status = dt.Rows[0]["status"];
            myModel.name = dt.Rows[0]["name"];
            myModel.display_name = dt.Rows[0]["display_name"];
            myModel.phone = dt.Rows[0]["phone"]; 
            return View(myModel);
        }
        [HttpGet]
        public ActionResult ExceptionLog()
        {
            string datepath = System.DateTime.Now.Year.ToString() + System.DateTime.Now.Month.ToString() + System.DateTime.Now.Day.ToString();
            string path = @"~/AppLog/ExpectionLog" + datepath + ".txt";
            if (System.IO.File.Exists(Server.MapPath(path)))
            {
                string[] texts = System.IO.File.ReadAllLines(Server.MapPath("~/AppLog/ExpectionLog" + datepath + ".txt"));
                ViewBag.Data = texts;
            }
            else
            {
                string[] message = { "No Record Found!" };
                ViewBag.Data = message;
                return View();
            }
            return View();
        }
        [HttpPost]
        public ActionResult ExceptionLog(FormCollection collection)
        {
            DateTime datepath = Convert.ToDateTime(collection["txtLogDate"]);
            string date = datepath.ToString("yyyyMMd");
            string path = @"~/AppLog/ExpectionLog" + date + ".txt";
            if (System.IO.File.Exists(Server.MapPath(path)))
            {
                string[] texts = System.IO.File.ReadAllLines(Server.MapPath("~/AppLog/ExpectionLog" + date + ".txt"));
                ViewBag.Data = texts;
                return View();
            }
            else
            {

                string[] message = { "No Record Found!" };
                ViewBag.Data = message;
                return View();
            }


        }
        public ActionResult OrderShippingRule()
        {
            return View();
        }
        public ActionResult ProductAttributesVariation()
        {
            return View();
        }
        // UpdateAttribute
        public ActionResult UpdateAttribute()
        {
            return View();
        }
        public ActionResult UserCompanyAllot()
        {
           int cmid= CommanUtilities.Provider.GetCurrent().login_company_id;
            string cmids = CommanUtilities.Provider.GetCurrent().user_companyid;
            return View();
        }
        public ActionResult ProductCompanyAllot()
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
            catch (Exception ex) { }
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
            string SSL = Convert.ToInt32(model.SSL).ToString();
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
            string podium_code = model.podium_code;
            string podium_refresh_code = model.podium_refresh_code;
            string podium_locationuid = model.podium_locationuid;
            SettingRepository.Updatesetting(model, id, email);

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
                    UserActivityLog.WriteDbLog(LogType.Submit, "Save global settings", "/Setting/Setting/" + model.ID + "" + ", " + Net.BrowserInfo);
                    Update_Setting(model, model.ID);
                    Update_EntityInfo(model, model.ID);
                    return Json(new { status = true, message = "Setting saved successfully, Please login again!!", url = "" }, 0);
                }

            }
            return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
        }
        //Code for setting end

        [HttpGet]
        public JsonResult GetPayPalToken(SearchModel model)
        {
            string result = string.Empty;
            bool b_status = false;
            try
            {
                result = clsPayPal.GetToken();
                b_status = true;
            }
            catch { b_status = false; result = ""; }
            return Json(new { status = b_status, message = result }, 0);
        }
        [HttpPost]
        public JsonResult CreatePayPalInvoice(SearchModel model)
        {
            string result = string.Empty;
            bool b_status = false;
            try
            {
                result = clsPayPal.CreatePaypalInvoice(model.strValue1, model.strValue2);
                b_status = true;
            }
            catch { b_status = false; result = ""; }
            return Json(new { status = b_status, message = result }, 0);
        }
        [HttpGet]
        public JsonResult GetPodiumToken(SearchModel model)
        {
            string result = string.Empty;
            bool b_status = false;
            try
            {
                result = clsPodium.GetToken();
                b_status = true;
            }
            catch { b_status = false; result = ""; }
            return Json(new { status = b_status, message = result }, 0);
        }
        [HttpGet]
        public JsonResult GetPodiumInvoice(SearchModel model)
        {
            string result = string.Empty;
            bool b_status = false;
            try
            {
                result = clsPodium.CreatePodiumInvoice(model.strValue1, model.strValue2, model.strValue3, model.strValue4, model.strValue5);
                b_status = true;
            }
            catch { b_status = false; result = ""; }
            return Json(new { status = b_status, message = result }, 0);
        }
        [HttpGet]
        public JsonResult GetPodiumInvoiceStatus(SearchModel model)
        {
            string result = string.Empty;
            try
            {
                string access_token = clsPodium.GetToken();
                result = clsPodium.GetPodiumInvoiceDetails(access_token, model.strValue1);
            }
            catch { result = ""; }
            return Json(result, 0);
        }
        [HttpGet]
        public JsonResult PodiumInvoiceRefund(clsPodiumModal model)
        {
            string result = string.Empty;
            try
            {
                result = clsPodium.PodiumInvoiceRefund(model);
            }
            catch { result = ""; }
            return Json(result, 0);
        }
        [HttpGet]
        [Route("Setting/cancel-podium-invoice")]
        public JsonResult CancelPodiumInvoice(SearchModel model)
        {
            string result = string.Empty;
            bool b_status = false;
            try
            {
                result = clsPodium.CancelPodiumInvoice(model.strValue1);
                b_status = true;
            }
            catch { b_status = false; result = ""; }
            return Json(new { status = b_status, message = result }, 0);
        }
        //For Order Shipping Rule

        [HttpPost]
        public JsonResult NewRule(SettingModel model)
        {
            if (ModelState.IsValid)
            {
                int RoleID = new SettingRepository().CheckDuplicateRoule(model);
                if (RoleID == 0)
                {
                    int ID = new SettingRepository().AddNewRule(model);
                    if (ID > 0)
                    {
                        ModelState.Clear();
                        return Json(new { status = true, message = "Rule saved successfully!!", url = "" }, 0);
                    }
                    else
                    {
                        return Json(new { status = false, message = "Invalid details", url = "" }, 0);
                    }
                }
                else
                {
                    return Json(new { status = false, message = "Rule Can not be duplicate", url = "" }, 0);
                }

            }
            return Json(new { status = false, message = "Invalid details", url = "" }, 0);
        }
        public JsonResult GetRule()
        {
            DataTable dt = new DataTable();
            dt = BAL.SettingRepository.GetRoule();
            List<SelectListItem> usertype = new List<SelectListItem>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                usertype.Add(new SelectListItem
                {
                    Value = dt.Rows[i]["rowid"].ToString(),
                    Text = dt.Rows[i]["name"].ToString()

                });
            }
            return Json(usertype, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult CreateShiprule(SettingModel model)
        {
            JsonResult result = new JsonResult();
            string msg = "";
            //int ID = 0;

            DataTable dt = SettingRepository.Getcountrystatecountry(model);
            if (dt.Rows.Count > 0 && model.ID == 0)
            {
                return Json(new { status = false, message = "Rule with state with same product already existed", url = "" }, 0);
            }
            else
            {

                if (model.ID > 0)
                {
                    //model.location = state[x].Trim();
                    SettingRepository.updateshippingrule(model);
                    msg = "Details updated successfully!!";
                    //return Json(new { status = true, message = "", url = "Manage" }, 0);
                }
                else
                {
                    //model.location = state[x].Trim();
                    SettingRepository.Addshippingruledetails(model);
                    //return Json(new { status = true, message = "Details has been saved successfully!!", url = "" }, 0);
                    msg = "Details save successfully!!";
                }
            }



            //if (!string.IsNullOrEmpty(model.location))
            //{
            //    string[] state = model.location.Split(',');
            //    for (int x = 0; x < state.Length; x++)
            //    {
            //        model.location = state[x].Trim();
            //        DataTable dt = SettingRepository.Getcountrystatecountry(model);
            //        if (dt.Rows.Count > 0 && model.ID == 0)
            //        {
            //            return Json(new { status = false, message = "Rule with state with same product has been already existed", url = "" }, 0);
            //        }
            //        else
            //        {

            //            if (model.ID > 0)
            //            {
            //                model.location = state[x].Trim();
            //                SettingRepository.updateshippingrule(model);
            //                msg = "Details has been updated successfully!!";
            //                //return Json(new { status = true, message = "", url = "Manage" }, 0);
            //            }
            //            else
            //            {
            //                model.location = state[x].Trim();
            //                SettingRepository.Addshippingruledetails(model);
            //                //return Json(new { status = true, message = "Details has been saved successfully!!", url = "" }, 0);
            //                msg = "Details has been save successfully!!";
            //            }
            //        }
            //    }
            //}
            //else
            //{
            //    msg = "Please Select State!!";               
            //}
            return Json(new { status = true, message = msg, url = "Manage" }, 0);

        }

        [HttpGet]
        public JsonResult GetShippingrulelist(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {

                DataTable dt = SettingRepository.GetShippingruleList(model.strValue1, model.strValue2, model.strValue3, model.strValue4, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, aaData = result }, 0);
        }

        public JsonResult GetEditDataID(OrderPostStatusModel model)
        {
            string JSONresult = string.Empty;
            try
            {

                DataTable dt = SettingRepository.GetEditDataID(model);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        public JsonResult deleteShippingrule(SettingModel model)
        {
            if (ModelState.IsValid)
            {

                int ID = new SettingRepository().deleteShipping(model);
                if (ID > 0)
                {
                    ModelState.Clear();
                    return Json(new { status = true, message = "Rule delete successfully!!", url = "" }, 0);
                }
                else
                {
                    return Json(new { status = false, message = "No data found for delete", url = "" }, 0);
                }
            }
            return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
        }

        [HttpGet]
        public JsonResult GetProductList()
        {
            string result = string.Empty;
            try
            {
                DataSet DS = SettingRepository.GetProducts();
                result = JsonConvert.SerializeObject(DS, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }

        public JsonResult GetWarehouse(SearchModel model)
        {
            DataSet ds = SetupRepostiory.GetWarehouse(model);
            List<SelectListItem> vendorlist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                vendorlist.Add(new SelectListItem { Text = dr["wname"].ToString(), Value = dr["wid"].ToString() });
            }
            return Json(vendorlist, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult ActivityDbLog(ActivityLogModel model)
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

        [HttpGet]
        public JsonResult ProductList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {

                DataTable dt = SettingRepository.ProductList(model.strValue1, model.strValue2, model.strValue3, model.strValue4, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);

            }
            catch { }
            return Json(result, 0);
            //return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, aaData = result }, 0);
        }
        public JsonResult GetattributesById(string strValue1)
        {
            string JSONResult = string.Empty;
            DataTable dt = new DataTable();
            try
            {
                dt = SettingRepository.GetattributesById(strValue1);
                JSONResult = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Json(JSONResult, 0);
        }

        public JsonResult Updateattribitues(string strValue1, string strValue2, int strValue3, int strValue4)
        {
            UserActivityLog.WriteDbLog(LogType.Submit, "Update attributes", "/Setting/Updateattribitues" + ", " + Net.BrowserInfo);
            //DataTable dt1 = SetupRepostiory.CountRuleForState(model);
            //if (dt1.Rows.Count > 0)
            //{
            //    return Json(new { status = false, message = "Product rule already exists for these states", url = "" }, 0);
            //}
            //else
            //{
            int ID = SettingRepository.Updateattribitues(strValue1, strValue2, strValue3, strValue4);
            if (ID > 0)
            {
                return Json(new { status = true, message = "Product Attributes update successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }
        }

        [HttpPost]
        public JsonResult UpdateCompany(clsUserDetails model)
        {

            int ID = SettingRepository.UpdateCompany(model);
            if (ID > 0)
            {
                UserActivityLog.WriteDbLog(LogType.Submit, "company id (" + model.ID + ") updated in company.", "/Setting/UpdateCompany?id=" + model.ID + "" + ", " + Net.BrowserInfo);
                 
                return Json(new { status = true, message = "User record updated successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }

        }

        [HttpGet]
        public JsonResult GetUserCompany(JqDataTableModel model)
        {
            string optType = model.strValue1;
            string result = string.Empty;
            try
            {
                DataTable dt = SettingRepository.GetUserCompany(optType);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }
        //public JsonResult Getcompany(SearchModel model)
        //{
        //    string optType = model.strValue1;
        //    DataSet ds = BAL.SettingRepository.Getcompany(optType);
        //    List<SelectListItem> productlist = new List<SelectListItem>();
        //    foreach (DataRow dr in ds.Tables[0].Rows)
        //    {
        //        productlist.Add(new SelectListItem { Text = dr["label"].ToString(), Value = dr["ID"].ToString() });
        //    }
        //    return Json(productlist, JsonRequestBehavior.AllowGet);
        //}

        public JsonResult GetcompanyData(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable DT = BAL.SettingRepository.GetcompanyData(model.strValue1);
                JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public JsonResult Selectcompanybiyid(long id)
        {

            string JSONresult = string.Empty;
            try
            {
                DataTable dt = SettingRepository.Selectcompanybiyid(id);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        [HttpPost]
        public JsonResult Updateusertocompany(SetupModel model)
        {
            if (model.searchid > 0)
            {
                UserActivityLog.WriteDbLog(LogType.Submit, "Update user company", "UserCompanyAllot/" + ", " + Net.BrowserInfo);

                SettingRepository.Updateusertocompany(model);
                    return Json(new { status = true, message = "User company updated successfully!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }

        }

        public JsonResult GetCompany()
        {
            string user_companyid = CommanUtilities.Provider.GetCurrent().user_companyid;
            DataSet ds = SettingRepository.GetCompany(user_companyid);
            List<SelectListItem> productlist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                productlist.Add(new SelectListItem { Text = dr["text"].ToString(), Value = dr["id"].ToString() });
            }
            return Json(productlist, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetProductCompany(JqDataTableModel model)
        {
            string optType = model.strValue1;
            string result = string.Empty;
            try
            {
                DataTable dt = SettingRepository.GetProductCompany(optType);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }

        [HttpPost]
        public JsonResult UpdateProducttocompany(SetupModel model)
        {
            if (model.searchid > 0)
            {
                UserActivityLog.WriteDbLog(LogType.Submit, "Update Product company", "ProductCompanyAllot/" + ", " + Net.BrowserInfo);

                SettingRepository.UpdateProducttocompany(model);
                return Json(new { status = true, message = "Product company updated successfully!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }

        }

        public JsonResult Selectproductcompanybiyid(long id)
        {

            string JSONresult = string.Empty;
            try
            {
                DataTable dt = SettingRepository.Selectproductcompanybiyid(id);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        [HttpPost]
        public JsonResult UpdateWebsite(string companyid, string company, string ids)
        { 
            if (companyid != "")
            {
                SettingRepository or = new SettingRepository();
                or.UpdateWebsite(companyid, company, ids);
                return Json(new { status = true, message = "Website update successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Something went wrong", url = "" }, 0);
            }

        }
    }
}