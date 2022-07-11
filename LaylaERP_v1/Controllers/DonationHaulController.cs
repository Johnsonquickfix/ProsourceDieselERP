using LaylaERP.BAL;
using LaylaERP.Controllers;
using LaylaERP.Models;
using LaylaERP.UTILITIES;
using LaylaERP_v1.BAL;
using Newtonsoft.Json;
using System;
using System.Data;
using System.Text.RegularExpressions;
using System.IO;
using System.Web;
using System.Web.Mvc;

namespace LaylaERP_v1.Controllers
{
    public class DonationHaulController : Controller
    {
        // GET: DonationHaul
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult DonateReceipt()
        {
            return View();
        }
        public JsonResult GetCustmerDonationHaulList(JqDataTableModel model)
        {
            DataTable dt = new DataTable();
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DateTime? fromdate = null, todate = null;
                if (!string.IsNullOrEmpty(model.strValue1))
                    fromdate = Convert.ToDateTime(model.strValue1);
                if (!string.IsNullOrEmpty(model.strValue2))
                    todate = Convert.ToDateTime(model.strValue2);
                dt = DonationHaulRepository.GetCustmerDonationHaulList(model.strValue4, model.strValue5, fromdate, todate, model.strValue3, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);

                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }

        [HttpPost]
        public JsonResult donationcusmail(OrderQuoteModel model)
        {
            string result = string.Empty;
            bool status = false;
            try
            {
                DataSet ds = DonationHaulRepository.donationcusmail(model.id);
                status = true;
                String renderedHTML = EmailNotificationsController.RenderViewToString("EmailNotifications", "DonateandHaulMail", ds);

                result = SendEmail.SendEmails_outer("christison.quickfix@gmail.com", "Donate and Haul tempted", renderedHTML, string.Empty);

                //result = SendEmail.SendEmails_outer(model.quote_header, "Your Donation #" + model.id + " has been received", renderedHTML, string.Empty);
            }
            catch (Exception ex) { status = false; result = ex.Message; }
            return Json(new { status = status, message = result }, 0);
        }
         
        [Route("donate/receipt")]
        public ActionResult DonateReceipt(string id)
        {
            long cusid = 0; 
            if (!string.IsNullOrEmpty(id))
            {
                cusid = Convert.ToInt64(LaylaERP.UTILITIES.CryptorEngine.Decrypt(id.Replace(" ", "+")));
                ViewBag.id = cusid;
            }
            else
                ViewBag.id = 5555;
            return View();
        }

        [HttpPost]
        public ActionResult FileUploade(string cusmerid, string desc, HttpPostedFileBase ImageFile)
        {
            try
            {
                if (ImageFile != null)
                {
                    ProductModel model = new ProductModel();
                    //Use Namespace called :  System.IO  
                    string FileName = Path.GetFileNameWithoutExtension(ImageFile.FileName);
                    FileName = Regex.Replace(FileName, @"\s+", "");
                    //To Get File Extension  
                    long filesize = ImageFile.ContentLength / 1024;
                    string FileExtension = Path.GetExtension(ImageFile.FileName);
                    if (FileExtension == ".xlsx" || FileExtension == ".xls" || FileExtension == ".XLS" || FileExtension == ".pdf" || FileExtension == ".PDF" || FileExtension == ".doc" || FileExtension == ".docx" || FileExtension == ".png" || FileExtension == ".PNG" || FileExtension == ".jpg" || FileExtension == ".JPG" || FileExtension == ".jpeg" || FileExtension == ".JPEG" || FileExtension == ".bmp" || FileExtension == ".BMP")
                    {
                        //Add Current Date To Attached File Name  
                        //FileName = DateTime.Now.ToString("yyyyMMdd") + "-" + FileName.Trim() + FileExtension;

                        FileName = FileName.Trim() + FileExtension;
                        string FileNameForsave = FileName;


                        DataTable dt = DonationHaulRepository.GetfileCountdata(Convert.ToInt32(cusmerid), FileName);
                        if (dt.Rows.Count > 0)
                        {
                            return Json(new { status = false, message = "File already uploaded", url = "" }, 0);
                        }
                        else
                        {

                            string UploadPath = Path.Combine(Server.MapPath("~/Content/DonateHaul"));
                            UploadPath = UploadPath + "\\";
                            //Its Create complete path to store in server.  
                            model.ImagePath = UploadPath + FileName;
                            //To copy and save file into server.  
                            ImageFile.SaveAs(model.ImagePath);
                            var ImagePath = "~/Content/DonateHaul/" + FileName;
                            int resultOne = DonationHaulRepository.FileUploade(Convert.ToInt32(cusmerid), FileName, filesize.ToString(), FileExtension, ImagePath, desc);

                            if (resultOne > 0)
                            {
                                return Json(new { status = true, message = "File upload successfully!!", url = "Manage" }, 0);
                            }
                            else
                            {
                                return Json(new { status = false, message = "Invalid details", url = "" }, 0);
                            }
                        }
                    }

                    else
                    {
                        return Json(new { status = false, message = "File type " + FileExtension + " not allowed", url = "" }, 0);
                    }
                }
                else
                {
                    return Json(new { status = false, message = "Please attach a document", url = "" }, 0);
                }
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = "Invalid details", url = "" }, 0);
            }

        }

    }
}