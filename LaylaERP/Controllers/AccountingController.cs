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
    public class AccountingController : Controller
    {
        // GET: Accounting Journal
        public ActionResult AccountingJournal()
        {
            return View();
        }

        // GET: chart of accounts
        public ActionResult chartofaccounts()
        {
            return View();
        }

        // GET: chart of productsaccount
        public ActionResult productsaccount()
        {
            return View();
        }

        public ActionResult AddAccount()
        {
            return View();
        }

        public ActionResult AddPcgType()
        {
            return View();
        }

        public ActionResult AccountBalance()
        {
            return View();
        }

        public ActionResult AccountJournal()
        {
            return View();
        }

        public ActionResult AccountLedger()
        {
            return View("AccountLedgerList");
        }

        //public ActionResult AccountLedgerList()
        //{
        //    return View();
        //}
        public JsonResult GetNatureofJournal(SearchModel model)
        {
            DataSet ds = BAL.AccountingRepository.GetNatureofJournal();
            List<SelectListItem> productlist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                productlist.Add(new SelectListItem { Text = dr["Nature"].ToString(), Value = dr["ID"].ToString() });
            }
            return Json(productlist, JsonRequestBehavior.AllowGet);
        }
        public JsonResult AddJournal(AccountingJournalModel model)
        {
            if (model.rowid > 0)
            {
                new AccountingRepository().EditJournal(model);
                return Json(new { status = true, message = "Journal has been updated successfully!!", url = "", id = model.rowid }, 0);
            }
            else
            {
                int ID = new AccountingRepository().AddJournal(model);
                if (ID > 0)
                {
                    ModelState.Clear();
                    return Json(new { status = true, message = "Journal has been saved successfully!!", url = "", id = ID }, 0);
                }
                else
                {
                    return Json(new { status = false, message = "Something went wrong!!", url = "", id = 0 }, 0);
                }
            }
        }
        public JsonResult GetJournalData(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = AccountingRepository.GetJournalData(model.strValue1, model.strValue2, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }

        public JsonResult GetJournalByID(long id)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = AccountingRepository.GetJournalByID(id);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        public JsonResult UpdateJournalStatus(AccountingJournalModel model)
        {
            if (model.rowid > 0)
            {
                new AccountingRepository().UpdateJournalStatus(model);
                return Json(new { status = true, message = "Journal status has been changed successfully!!", url = "", id = model.rowid }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Something went wrong!!", url = "", id = 0 }, 0);
            }
        }

        public JsonResult UpdateChartOfAccountStatus(AccountingJournalModel model)
        {
            if (model.rowid > 0)
            {
                new AccountingRepository().UpdateChartOfAccountStatus(model);
                return Json(new { status = true, message = "Status has been changed successfully!!", url = "", id = model.rowid }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Something went wrong!!", url = "", id = 0 }, 0);
            }
        }

        public JsonResult GetParentAccount()
        {
            DataSet ds = AccountingRepository.GetPcgType();
            List<SelectListItem> accountsettinglist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {

                accountsettinglist.Add(new SelectListItem { Text = dr["pcg_type"].ToString(), Value = dr["account_parent"].ToString() });

            }
            return Json(accountsettinglist, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetChartOfAccounts(SearchModel model)
        {

            string JSONresult = string.Empty;
            try
            {
                DataTable dt = AccountingRepository.GetChartOfAccounts(model);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        [HttpGet]
        public JsonResult GetProductStock(JqDataTableModel model)
        {
            string optType = model.strValue1;
            string result = string.Empty;
            try
            {
                DataTable dt = AccountingRepository.GetProductStock(optType);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }

        public JsonResult GetNewAccounttoAssign(SearchModel model)
        {
            string optType = model.strValue1;
            DataSet ds = BAL.AccountingRepository.GetNewAccounttoAssign(optType);
            List<SelectListItem> productlist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                productlist.Add(new SelectListItem { Text = dr["label"].ToString(), Value = dr["ID"].ToString() });
            }
            return Json(productlist, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult AddAccount(AccountingModel model)
        {
            if (ModelState.IsValid)
            {
                if (model.rowid > 0 )
                {
                    AccountingRepository.UpdateAccount(model);
                    return Json(new { status = true, message = "Data has been updated successfully!!", url = "", id = model.rowid }, 0);
                }
                else
                {
                    //int ID = 1;
                    int ID = AccountingRepository.AddAccount(model);
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

        public ActionResult EditAccount()
        {
            return View();
        }

        public JsonResult GetAccountByID(long id)
        {
            //CommercialProposalModel model = new CommercialProposalModel();
            //ViewBag.id = model.rowid;
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = AccountingRepository.GetAccountByID(id);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        [HttpPost]
        public JsonResult AddProductAccount(ProductAccountingModel model)
        {
            if (ModelState.IsValid)
            {
                string ProductID = model.strValue1;
                string option_mode = model.option_mode;
                string ProductAccountNumberID = model.strValue2;

                if (model.ID > 0)
                {
                    //new ThirdPartyRepository().EditVendorBasicInfo(model);
                    //return Json(new { status = true, message = "Product account has been updated successfully!!", url = "", id = model.rowid }, 0);
                }
                else
                {
                    int ID = new AccountingRepository().AddProductAccount(ProductID, option_mode, ProductAccountNumberID);
                    if (ID > 0)
                    {
                        return Json(new { status = true, message = "Product account has been saved successfully!!", url = "", id = ID }, 0);
                    }
                    else
                    {
                        return Json(new { status = false, message = "something went wrong!! Product Account not saved ", url = "", id = 0 }, 0);
                    }
                }
            }
            return Json(new { status = false, message = "Invalid Details", url = "", id = 0 }, 0);
        }


        public JsonResult AddPcgTypeDetails(PcgtypeModel model)
        {
            int ID = AccountingRepository.AddPcgTypeDetails(model);
            if (ID > 0)
            {
                return Json(new { status = true, message = "Pcg Type has been saved successfully!!", url = "", id = ID }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Something went wrong!!", url = "", id = 0 }, 0);
            }
        }

        public JsonResult GetPcgTypeList()
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = AccountingRepository.GetPcgTypeList();
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public JsonResult GetPcgTypeById(string strValue1)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = AccountingRepository.GetPcgTypeById(strValue1);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public JsonResult UpdatePcgType(PcgtypeModel model)
        {
            if (model.rowid > 0)
            {
                AccountingRepository.UpdatePcgType(model);
                return Json(new { status = true, message = "Data has been saved successfully!!", url = "", id = model.rowid }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Something went wrong!!", url = "", id = 0 }, 0);
            }
        }

        public JsonResult AccountBalanceList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = AccountingRepository.AccountBalanceList(model.strValue2, model.strValue1, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }

        public JsonResult AccountJournalList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = AccountingRepository.AccountJournalList(model.strValue2, model.strValue1, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }

        public JsonResult AccountLedgerList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = AccountingRepository.AccountLedgerList(model.strValue2, model.strValue1, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }

        public JsonResult GrandTotal()
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = AccountingRepository.GrandTotal();
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Account Ledger~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        [HttpGet]
        public JsonResult GetAccountLedgerDetailsList(JqDataTableModel model)
        {
            string result = string.Empty;
            try
            {
                DataTable dt = AccountingRepository.GetAccountLedgerDetailsList(model.strValue1, model.strValue2, model.strValue3);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }

        [HttpPost]
        public JsonResult GetDetailsLedger(JqDataTableModel model)
        {
            string result = string.Empty;
            try
            {
                DataTable dt = AccountingRepository.GetDetailsLedger(model.strValue1, model.strValue2, model.strValue3);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }
        public JsonResult GetVendor(SearchModel model)
        {
            DataSet ds = BAL.AccountingRepository.GetVendor();
            List<SelectListItem> productlist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                productlist.Add(new SelectListItem { Text = dr["Name"].ToString(), Value = dr["ID"].ToString() });
            }
            return Json(productlist, JsonRequestBehavior.AllowGet);

        }
        public JsonResult DatewithVendoreTotal(JqDataTableModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = AccountingRepository.DatewithVendoreTotal(model.strValue1, model.strValue2, model.strValue3);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public JsonResult JournalDatewithVendoreTotal(JqDataTableModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = AccountingRepository.JournalDatewithVendoreTotal(model.strValue1, model.strValue2, model.strValue3);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }
    }
}