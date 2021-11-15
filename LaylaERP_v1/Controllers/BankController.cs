using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;
using LaylaERP.BAL;
using LaylaERP.Models;
using Newtonsoft.Json;

namespace LaylaERP.Controllers
{
    public class BankController : Controller
    {
        // GET: Bank
        public ActionResult financialaccount(long id)
        {
            ViewBag.id = id;
            return View();
        }

        // GET: Add Fin A/C
        public ActionResult newfinaccount()
        {
            return View();
        }

        public ActionResult BankAccountList()
        {
            return View();
        }

        public ActionResult EditBankAccount()
        {
            return View();
        }

        public ActionResult BankEntriesAll()
        {
            return View();
        }

        [HttpPost]
        public JsonResult AddBankAccount(BankModel model)
        {
            if (ModelState.IsValid)
            {
                if (model.rowid > 0)
                {

                }
                else
                {
                    int ID = 1;   
                    //int ID = BankRepository.AddBankAccount(model);
                    if (ID > 0)
                    {
                        return Json(new { status = true, message = "Data has been saved successfully!!", url = "" }, 0);
                    }
                    else
                    {
                        return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
                    }
                }
            }
            return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
        }
        
        public JsonResult GetAccountingAccount(SearchModel model)
        {
            DataSet ds = BankRepository.GetAccountingAccount();
            List<SelectListItem> productlist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                productlist.Add(new SelectListItem { Text = dr["label"].ToString(), Value = dr["ID"].ToString() });
            }
            return Json(productlist, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Getjournal(SearchModel model)
        {
            DataSet ds = BankRepository.Getjournal();
            List<SelectListItem> productlist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                productlist.Add(new SelectListItem { Text = dr["label"].ToString(), Value = dr["ID"].ToString() });
            }
            return Json(productlist, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetBankAccount()
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = BankRepository.GetBankAccount();
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public JsonResult GetAccountByID(long id)
        {

            string JSONresult = string.Empty;
            try
            {
                DataTable dt = BankRepository.GetAccountByID(id);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public JsonResult UpdateBankAccount(BankModel model)
        {
            if (model.rowid> 0)
            {
                BankRepository.UpdateBankAccount(model);
                return Json(new { status = true, message = "Data has been saved successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }
        }

        [HttpPost]
        public ActionResult FileUpload(int BankID, HttpPostedFileBase ImageFile)
        {
            try
            {
                BankModel model = new BankModel();
                if (ImageFile != null)
                {
                    string FileName = Path.GetFileNameWithoutExtension(ImageFile.FileName);
                    FileName = Regex.Replace(FileName, @"\s+", "");
                    string size = (ImageFile.ContentLength / 1024).ToString();
                    string FileExtension = Path.GetExtension(ImageFile.FileName);
                    if (FileExtension == ".xlsx" || FileExtension == ".xls" || FileExtension == ".pdf" || FileExtension == ".doc" || FileExtension == ".docx" || FileExtension == ".png" || FileExtension == ".jpg" || FileExtension == ".jpeg")
                    {
                        FileName = FileName.Trim() + FileExtension;
                        string FileNameForsave = FileName;
                        DataTable dt = BankRepository.GetfileCountdata(BankID, FileName);
                        if (dt.Rows.Count > 0)
                        {
                            return Json(new { status = false, message = "File already exist in table", url = "" }, 0);
                        }
                        else
                        {
                            string UploadPath = Path.Combine(Server.MapPath("~/Content/BankLinkedFiles"));
                            UploadPath = UploadPath + "\\";
                            model.ImagePath = UploadPath + FileName;
                            var ImagePath = "~/Content/BankLinkedFiles/" + FileName;
                            ImageFile.SaveAs(model.ImagePath);
                            int resultOne = BankRepository.FileUpload(BankID, FileName, ImagePath, FileExtension, size);
                            if (resultOne > 0)
                            {
                                return Json(new { status = true, message = "File Upload successfully!!", url = "" }, 0);
                            }
                            else
                            {
                                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
                            }
                        }
                    }
                    else
                    {
                        return Json(new { status = false, message = "File Type " + FileExtension + " Not allowed", url = "" }, 0);
                    }
                }
                else
                {
                    return Json(new { status = false, message = "Please attach a document", url = "" }, 0);
                }
            }
            catch (Exception)
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }

        }
        [HttpPost]
        public JsonResult GetBankLinkedFiles(ThirdPartyModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                long id = model.rowid;
                string urid = "";
                if (model.user_status != "")
                    urid = model.user_status;
                string searchid = model.Search;
                ViewBag.AttachedFiles = "0";
                DataTable dt = BankRepository.GetBankLinkedFiles(id, urid, searchid, model.PageNo, model.PageSize, out TotalRecord, model.SortCol, model.SortDir);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }

        public JsonResult DeleteBankLinkedFiles(BankModel model)
        {
            if (model.rowid > 0)
            {
                int ID = BankRepository.DeleteBankLinkedFiles(model);
                if (ID > 0)
                    return Json(new { status = true, message = "Bank Linked Files has been deleted successfully!!", url = "", id = ID }, 0);
                else
                    return Json(new { status = false, message = "Invalid Details", url = "", id = 0 }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Bank info not Found", url = "", id = 0 }, 0);
            }
        }

        public JsonResult GetEntries(string id)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = BankRepository.GetEntries(id);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public JsonResult BankEntriesList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = BankRepository.BankEntriesList(model.strValue2,model.strValue1, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }

        public JsonResult AllBankEntriesList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = BankRepository.AllBankEntriesList(model.strValue2, model.strValue1, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }
        public JsonResult GetBankEntriesBalance()
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = BankRepository.BankEntriesBalance();
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }
    }
}