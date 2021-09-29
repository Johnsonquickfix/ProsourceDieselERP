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
    public class EmailSettingController : Controller
    {
        // GET: EmailSetting
        public ActionResult EmailNotifications()
        {
            ViewBag.emailfromname = EmailNotificationsRepository.emailfromname().ToString();
            ViewBag.emailfromaddress = EmailNotificationsRepository.emailfromaddress().ToString();
            ViewBag.emailheaderimage = EmailNotificationsRepository.emailheaderimage().ToString();
            ViewBag.emailfootertext = EmailNotificationsRepository.emailfootertext().ToString();
            return View();
        }

        // GET: EmailSetting
        public ActionResult ManageEmailNotifications()
        {
            return View();
        }

        [HttpGet]
        public JsonResult GetEmailList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {

                DataTable dt = EmailNotificationsRepository.GetEmailList(model.strValue1, model.strValue2, model.strValue3, model.strValue4, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, aaData = result }, 0);
        }

        public JsonResult UpdateEmailNotification(EmailSettingModel model)
        {
            JsonResult result = new JsonResult();
            DateTime dateinc = DateTime.Now;
            var resultOne = 0;
            DataTable dt = EmailNotificationsRepository.Getoption_Details(model);   
                if (dt.Rows.Count > 0) 
                     resultOne = EmailNotificationsRepository.updateEmailNotification(model); 
                else          
                     resultOne = EmailNotificationsRepository.AddEmailNotification(model);     
                
                return Json(new { status = true, message = "updated successfully!!", url = "Manage" }, 0);
        }
        [HttpPost]
        public JsonResult GetDetails(SearchModel model)
        {
            EmailSettingModel obj = new EmailSettingModel();
            try
            {
                if (string.IsNullOrEmpty(model.strValue1))
                {
                    throw new Exception("Invalid Data");
                }
                obj = EmailNotificationsRepository.GetDetails(model.strValue1);
            
            }
            catch { }
            return Json(obj, 0);
        }

        public JsonResult Updatewoocommerce(EmailSettingModel model)
        {
            string[] varQueryArr1 = new string[4];
            string[] varFieldsName = new string[4] { "woocommerce_email_from_name", "woocommerce_email_from_address", "woocommerce_email_header_image", "woocommerce_email_footer_text" };
            string[] varFieldsValue = new string[4] { model.option_name, model.email_type, model.additional_content, model.email_heading };
            string[] ids = new string[4] { "225", "226", "227", "228" };
            for (int n = 0; n < 4; n++)
            {
                EmailNotificationsRepository.UpdateMetaData(ids[n], varFieldsName[n], varFieldsValue[n]);
            }
            return Json(new { status = true, message = "updated successfully!!", url = "Manage" }, 0);
        }

       
        
    }
}