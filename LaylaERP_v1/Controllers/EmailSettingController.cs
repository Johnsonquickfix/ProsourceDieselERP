using LaylaERP.BAL;
using LaylaERP.Models;
using LaylaERP.UTILITIES;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
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
        public ActionResult ManageEmailNotifications(string id)
        {           
           EmailSettingModel obj = EmailNotificationsRepository.GetDetails(id);
            
            ViewBag.filename = obj.filename; //EmailNotificationsRepository.filename(id).ToString();
            ViewBag.emailtext = EmailNotificationsRepository.filename(id).ToString();
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

            if (string.IsNullOrEmpty(model.filename))
                model.filename = "Index";          
            string path = Path.Combine(Server.MapPath("~/Views/EmailNotifications"));
            path = path + "\\" + model.filename + ".cshtml";
            if (System.IO.File.Exists(path))
            {
                model.filename = model.filename + ".cshtml";
                DataTable dt = EmailNotificationsRepository.Getoption_Details(model);
                if (dt.Rows.Count > 0)
                    resultOne = EmailNotificationsRepository.updateEmailNotification(model);
                else
                    resultOne = EmailNotificationsRepository.AddEmailNotification(model);
                UserActivityLog.WriteDbLog(LogType.Submit, "Email notification setting", "/EmailSetting/ManageEmailNotifications/"+ model.filename + "" + ", " + Net.BrowserInfo);
                return Json(new { status = true, message = "updated successfully!!", url = "Manage" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "File name is not exist please contact to administrator.", url = "Manage" }, 0);
            }
  
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
            UserActivityLog.WriteDbLog(LogType.Submit, "Save email sender options", "/EmailSetting/EmailNotifications" + ", " + Net.BrowserInfo);

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
       
        [ValidateInput(false)]
        [HttpPost]
        public ActionResult createfile(string text,string filename)
        {
            //string path = Server.MapPath("~/EmailNotifications/test.txt");
            // string path = "D:/LaylaERP/LaylaERP/Views/EmailNotifications/NewOrderTest.cshtml";

            //var filename = "NewOrderTest.cshtml";
            UserActivityLog.WriteDbLog(LogType.Submit, "Update Template", "/EmailSetting/ManageEmailNotifications/"+ filename + "" + ", " + Net.BrowserInfo);
            string path = Path.Combine(Server.MapPath("~/Views/EmailNotifications"));
            path = path + "\\" + filename;

            using (StreamWriter sw = System.IO.File.CreateText(path))
            {
                sw.WriteLine(text);
            }
            //EmailNotifications();
            //return View();
            //  return View("EmailSetting/EmailNotifications");
            return RedirectToAction("EmailNotifications");
        }

    }
}