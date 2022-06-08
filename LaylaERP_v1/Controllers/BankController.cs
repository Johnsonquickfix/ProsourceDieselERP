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
using LaylaERP.UTILITIES;
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
            int ID = BankRepository.AddBankAccount(model);
            if (ID > 0)
            {
                return Json(new { status = true, message = "Bank data saved successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }
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

        public JsonResult GetBankAccountList()
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = BankRepository.GetBankAccountList();
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
            if (model.rowid > 0)
            {
                UserActivityLog.WriteDbLog(LogType.Submit, "Update bank accounts", "Bank/financialaccount/" + model.rowid + "" + ", " + Net.BrowserInfo);
                BankRepository.UpdateBankAccount(model);
                return Json(new { status = true, message = "Bank data updated successfully!!", url = "" }, 0);
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
                                UserActivityLog.WriteDbLog(LogType.Submit, "Upload bank linked files", "/Bank/financialaccount/" + BankID + "" + ", " + Net.BrowserInfo);
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
                UserActivityLog.WriteDbLog(LogType.Submit, "Delete bank linked files", "/Bank/financialaccount/" + model.rowid + "" + ", " + Net.BrowserInfo);
                int ID = BankRepository.DeleteBankLinkedFiles(model);
                if (ID > 0)
                    return Json(new { status = true, message = "Bank linked files deleted successfully!!", url = "", id = ID }, 0);
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
        [HttpGet]
        [Route("bank/bank-transactions")]
        public JsonResult BankEntriesList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0; decimal opening_balance = 0, closing_balance = 0, uncleared_balance = 0;
            try
            {
                DateTime? fromdate = null, todate = null;
                if (!string.IsNullOrEmpty(model.strValue2))
                    fromdate = Convert.ToDateTime(model.strValue2);
                if (!string.IsNullOrEmpty(model.strValue3))
                    todate = Convert.ToDateTime(model.strValue3);
                DataTable dt = BankRepository.BankEntriesList(model.strValue1, fromdate, todate, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, out opening_balance, out closing_balance, out uncleared_balance, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, opening_balance = opening_balance, closing_balance = closing_balance, uncleared_balance = uncleared_balance, aaData = result }, 0);
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

        public JsonResult BankEntriesBalanceForSpecific(long id)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = BankRepository.BankEntriesBalanceForSpecific(id);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public JsonResult PendingBankEntriesList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = BankRepository.PendingBankEntriesList(model.strValue2, model.strValue1, model.strValue3, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }
        public JsonResult PendingBankEntriesBalance(long id)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = BankRepository.PendingBankEntriesBalance(id);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        public JsonResult FundTransferlist(JqDataTableModel model)
        {
            string result = string.Empty;
            try
            {

                DataTable dt = BankRepository.Fundtransferlist(model.strValue1, model.strValue2, model.strValue3);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
                //  DataTable dt = AccountingRepository.GetAccountLedgerDetailsList(model.strValue1, model.strValue2, model.strValue3);

            }
            catch (Exception ex) { throw ex; }
            return Json(result, 0);
        }

        public JsonResult BankFundTransfer(string bank, string inv_complete, string inv_num)
        {
            var dt = BankRepository.BankFundTransfer(bank, inv_complete, inv_num);
            if (dt > 0)
            {
                BankRepository.FundTransferInvoice(bank, inv_complete);
                return Json(new { status = true, message = "Fund transfer successfully !", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid details !", url = "" }, 0);
            }
        }
    }
}