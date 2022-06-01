using LaylaERP.BAL;
using LaylaERP.Models;
using LaylaERP.UTILITIES;
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

        public ActionResult AccountLedger()
        {
            return View("AccountLedgerList");
        }

        public ActionResult AccountJournal()
        {
            return View();
        }

        public ActionResult ChartOfAccountEntry()
        {
            return View();
        }

        public ActionResult ChartAccountEntryList()
        {
            return View();
        }
        public ActionResult EditChartAccountEntry()
        {
            return View();
        }        
        public ActionResult ProfitLossAccount()
        {
            return View();
        }
        public ActionResult Balancesheet()
        {
            return View();
        }
        public ActionResult Balancesheetlist()
        {
            return View();
        }
        public ActionResult AccountCategorylist()
        {
            return View();
        }
        public ActionResult ProfitLossAccountList()
        {
            return View();
        }
        public ActionResult AccountFiscalYearList()
        {
            return View();
        }
        public ActionResult FunddepositList()
        {
            return View();
        }
        public ActionResult NewTranscationType()
        {
            return View();
        }
        public ActionResult AccountList()
        {
            return View();
        }
        public ActionResult AccountReport()
        {
            return View();
        }
        public ActionResult BankReconciliation()
        {
            return View();
        }
        
        public ActionResult BankReconciliationprocess()
        {
            return View();
        }

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
                UserActivityLog.WriteDbLog(LogType.Submit, "journal id (" + model.rowid + ") updated in Accounting Journal.", "/Accounting/AccountingJournal" + ", " + Net.BrowserInfo);
                new AccountingRepository().EditJournal(model);
                return Json(new { status = true, message = "Journal updated successfully!!", url = "", id = model.rowid }, 0);
            }
            else
            {
                int ID = new AccountingRepository().AddJournal(model);
                if (ID > 0)
                {
                    UserActivityLog.WriteDbLog(LogType.Submit, "create new journal " + model.label + " in Accounting Journal.", "/Accounting/AccountingJournal" + ", " + Net.BrowserInfo);
                    ModelState.Clear();
                    return Json(new { status = true, message = "Journal saved successfully!!", url = "", id = ID }, 0);
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
                return Json(new { status = true, message = "Journal status changed successfully!!", url = "", id = model.rowid }, 0);
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
                return Json(new { status = true, message = "Status changed successfully!!", url = "", id = model.rowid }, 0);
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
        public JsonResult GetName()
        {
            DataSet ds = AccountingRepository.GetName();
            List<SelectListItem> accountsettinglist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                accountsettinglist.Add(new SelectListItem { Text = dr["label"].ToString(), Value = dr["account_number"].ToString() });
            }
            return Json(accountsettinglist, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetDetailType(string strValue2)
        {
            DataSet ds = AccountingRepository.GetDetailType(strValue2);
            List<SelectListItem> accountsettinglist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                accountsettinglist.Add(new SelectListItem { Text = dr["labelshort"].ToString(), Value = dr["rowid"].ToString() });
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
                if (model.rowid > 0)
                {
                    AccountingRepository.UpdateAccount(model);
                    UserActivityLog.WriteDbLog(LogType.Submit, "account id (" + model.rowid + ") updated in Chart of Accounts.", "/Accounting/AddAccount/" + model.rowid + "" + ", " + Net.BrowserInfo);
                    return Json(new { status = true, message = "Chart of account updated successfully!!", url = "", id = model.rowid }, 0);
                }
                else
                {
                    DataTable dt = AccountingRepository.Checkaccountnumber(model);
                    if (dt.Rows.Count > 0)
                    {
                        return Json(new { status = false, message = "Account number already exist", url = "" }, 0);
                    }
                    else
                    {
                        //int ID = 1;
                        int ID = AccountingRepository.AddAccount(model);
                        if (ID > 0)
                        {
                            UserActivityLog.WriteDbLog(LogType.Submit, "New account " + model.pcg_type + " created in Chart of Accounts.", "/Accounting/AddAccount" + ", " + Net.BrowserInfo);
                            return Json(new { status = true, message = "Chart of account saved successfully!!", url = "" }, 0);
                        }
                        else
                        {
                            return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
                        }
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
                        return Json(new { status = true, message = "Product account saved successfully!!", url = "", id = ID }, 0);
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
                UserActivityLog.WriteDbLog(LogType.Submit, "create new General Account " + model.pcg_type + " in General Accounts.", "/Accounting/AddPcgType" + ", " + Net.BrowserInfo);
                return Json(new { status = true, message = "Pcg type saved successfully!!", url = "", id = ID }, 0);
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
                UserActivityLog.WriteDbLog(LogType.Submit, "Account id (" + model.rowid + ") updated in General Accounts.", "/Accounting/productsaccount" + ", " + Net.BrowserInfo);
                AccountingRepository.UpdatePcgType(model);
                return Json(new { status = true, message = "Data updated successfully!!", url = "", id = model.rowid }, 0);
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
                DataTable dt = AccountingRepository.AccountBalanceList(model.strValue3, model.strValue2, model.strValue1, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch (Exception ex) { throw ex; }
            return Json(result, 0);
            //return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }

        public JsonResult AccountBalanceGrandTotal(JqDataTableModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = AccountingRepository.AccountBalanceGrandTotal(model.strValue1, model.strValue2);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public JsonResult AccountJournalList(JqDataTableModel model)
        {
            string result = string.Empty;
            try
            {
                DateTime fromdate = DateTime.Today, todate = DateTime.Today;
                if (!string.IsNullOrEmpty(model.strValue1))
                    fromdate = Convert.ToDateTime(model.strValue1);
                if (!string.IsNullOrEmpty(model.strValue2))
                    todate = Convert.ToDateTime(model.strValue2);
                long aid = 0, vid = 0;
                if (!string.IsNullOrEmpty(model.strValue3))
                    aid = Convert.ToInt64(model.strValue3);
                DataTable dt = AccountingRepository.AccountJournalList(aid, vid, fromdate, todate);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch (Exception ex) { throw ex; }
            return Json(result, 0);
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

        public JsonResult AddChartOfAccountEntry(ChartAccountEntryModel model)
        {
            //int ID = 1;
            int ID = AccountingRepository.AddChartOfAccountEntry(model);
            if (ID > 0)
            {
                //UserActivityLog.WriteDbLog(LogType.Submit, "create new General Account " + model.pcg_type + " in General Accounts.", "/Accounting/AddPcgType" + ", " + Net.BrowserInfo);
                return Json(new { status = true, message = "Chart of account entry saved successfully", url = "", id = ID }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Something went wrong!!", url = "", id = 0 }, 0);
            }
        }

        public JsonResult GetChartAccountEntryListNotUsed(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = AccountingRepository.GetChartAccountEntryListNotUsed(model.strValue1, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }
        public JsonResult GetChartAccountEntryById(long id)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = AccountingRepository.GetChartAccountEntryById(id);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        public JsonResult UpdateChartOfAccountEntry(ChartAccountEntryModel model)
        {
            if (model.rowid > 0)
            {
                //UserActivityLog.WriteDbLog(LogType.Submit, "Account id (" + model.rowid + ") updated in General Accounts.", "/Accounting/productsaccount" + ", " + Net.BrowserInfo);
                AccountingRepository.UpdateChartOfAccountEntry(model);
                return Json(new { status = true, message = "Chart of account entry updated successfully!!", url = "", id = model.rowid }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Something went wrong!!", url = "", id = 0 }, 0);
            }
        }
        public JsonResult GetType(string strValue2)
        {
            DataSet ds = AccountingRepository.GetType(strValue2);
            List<SelectListItem> accountsettinglist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                accountsettinglist.Add(new SelectListItem { Text = dr["pcg_type"].ToString(), Value = dr["account_parent"].ToString() });
            }
            return Json(accountsettinglist, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCharofaccountentrygrandtotal()
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = AccountingRepository.GetCharofaccountentrygrandtotal();
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        [HttpPost]
        public ActionResult AccountProfitLossList(string Year, string Month)
        {
            //var from_date = new DateTime(Convert.ToInt32(Year), Convert.ToInt32(Month), 1);
            //var to_date = from_date.AddMonths(1).AddDays(-1);

            //DateTime? fromdate = null, todate = null;
            //if (!string.IsNullOrEmpty(Year))
            //    fromdate = Convert.ToDateTime(Year);
            //if (!string.IsNullOrEmpty(Month))
            //    todate = Convert.ToDateTime(Month);

            AccountingRepository.AccountProfitLossList(Month.ToString(), Year.ToString());
            var k = Json(new { data = AccountingRepository.exportorderlist }, JsonRequestBehavior.AllowGet);
            k.MaxJsonLength = int.MaxValue;
            return k;
        }
        public JsonResult AccountProfitLossTotal(JqDataTableModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = AccountingRepository.AccountProfitLossTotal(model.strValue1, model.strValue2);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        public JsonResult GetChartAccountEntryList()
        {
            string result = string.Empty;
            try
            {
                DataTable dt = AccountingRepository.GetChartAccountEntryList();
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }

        [HttpGet]
        public JsonResult GetAccountbalancesheet(JqDataTableModel model)
        {
            string result = string.Empty;
            try
            {
                DataTable dt = AccountingRepository.GetAccountbalancesheet(model.strValue1, model.strValue2);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }

        [HttpPost]
        public JsonResult GetAccountbalancesheetDetails(JqDataTableModel model)
        {
            string result = string.Empty;
            try
            {
                DataTable dt = AccountingRepository.GetAccountbalancesheetDetails(model.strValue1, model.strValue2, model.strValue3);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }

        [HttpGet]
        public JsonResult exportbalancesheet(JqDataTableModel model)
        {
            string result = string.Empty;
            try
            {
                //DateTime? fromdate = null, todate = null;
                //if (!string.IsNullOrEmpty(model.strValue5))
                //    fromdate = Convert.ToDateTime(model.strValue5);
                //if (!string.IsNullOrEmpty(model.strValue6))
                //    todate = Convert.ToDateTime(model.strValue6);
                DataSet ds = AccountingRepository.exportbalancesheet(model.strValue1, model.strValue2, model.sSearch);
                // DataSet ds = InventoryRepository.exportProductStock(model.strValue1, model.strValue2, model.strValue3, model.strValue4, fromdate, todate);
                result = JsonConvert.SerializeObject(ds, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }
        [HttpGet]
        public JsonResult GetAccountBalance(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                long id = 0;
                //if (!string.IsNullOrEmpty(model.strValue1))
                //    id = Convert.ToInt64(model.strValue1);
                DataSet ds = AccountingRepository.GetAccountBalance(model.strValue1, model.strValue2);
                JSONresult = JsonConvert.SerializeObject(ds);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public JsonResult GetAccountCategory()
        {
            DataSet ds = AccountingRepository.GetAccountCategory();
            List<SelectListItem> accountsettinglist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                accountsettinglist.Add(new SelectListItem { Text = dr["account_category"].ToString(), Value = dr["rowid"].ToString() });
            }
            return Json(accountsettinglist, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetAccountCategoryList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = AccountingRepository.GetAccountCategoryList(model.strValue2, model.strValue1, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch (Exception ex) { throw ex; }
            return Json(result, 0);
            //return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }

        public JsonResult AddAccountCategory(AccountCategoryModel model)
        {
            //int ID = 1;
            int ID = AccountingRepository.AddAccountCategory(model);
            if (ID > 0)
            {
                //UserActivityLog.WriteDbLog(LogType.Submit, "create new General Account " + model.pcg_type + " in General Accounts.", "/Accounting/AddPcgType" + ", " + Net.BrowserInfo);
                return Json(new { status = true, message = "Category of account saved successfully", url = "", id = ID }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Something went wrong!!", url = "", id = 0 }, 0);
            }
        }
        public JsonResult UpdateAccountCategory(AccountCategoryModel model)
        {
            if (model.rowid > 0)
            {
                AccountingRepository.UpdateAccountCategory(model);
                //UserActivityLog.WriteDbLog(LogType.Submit, "create new General Account " + model.pcg_type + " in General Accounts.", "/Accounting/AddPcgType" + ", " + Net.BrowserInfo);
                return Json(new { status = true, message = "Category of account update successfully", url = "", id = model.rowid }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Something went wrong!!", url = "", id = 0 }, 0);
            }
        }

        public JsonResult GetAccountCategoryById(string strValue1)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = AccountingRepository.GetAccountCategoryById(strValue1);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        [HttpGet]
        public JsonResult GetAccountProfitLoss(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                long id = 0;
                //if (!string.IsNullOrEmpty(model.strValue1))
                //    id = Convert.ToInt64(model.strValue1);
                DataSet ds = AccountingRepository.GetAccountProfitLoss(model.strValue1, model.strValue2);
                JSONresult = JsonConvert.SerializeObject(ds);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        public JsonResult Getfinancialyear(SearchModel model)
        {
            DataSet ds = BAL.AccountingRepository.Getfinancialyear();
            List<SelectListItem> productlist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                if (dr["status"].ToString() == "1")
                    productlist.Add(new SelectListItem { Text = dr["Name"].ToString(), Value = dr["ID"].ToString(), Selected = true });
                else
                    productlist.Add(new SelectListItem { Text = dr["Name"].ToString(), Value = dr["ID"].ToString() });
            }
            return Json(productlist, JsonRequestBehavior.AllowGet);

        }

        public JsonResult GetAccountFiscalYearList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = AccountingRepository.GetAccountFiscalYearList(model.strValue2, model.strValue1, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch (Exception ex) { throw ex; }
            return Json(result, 0);
            //return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }

        public JsonResult AddAccountFiscalYear(FiscalYearModel model)
        {
            //int ID = 1;
            int ID = AccountingRepository.AddAccountFiscalYear(model);
            if (ID > 0)
            {
                return Json(new { status = true, message = "Fiscal year saved successfully", url = "", id = ID }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Something went wrong!!", url = "", id = 0 }, 0);
            }
        }
        public JsonResult GetAccountFiscalYearById(string strValue1)
        {
            string result = string.Empty;
            try
            {
                DataTable dt = AccountingRepository.GetAccountFiscalYearById(strValue1);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch (Exception ex) { throw ex; }
            return Json(result, 0);
        }

        public JsonResult UpdateAccountFiscalYear(FiscalYearModel model)
        {
            if (model.rowid > 0)
            {
                AccountingRepository.UpdateAccountFiscalYear(model);
                return Json(new { status = true, message = "Fiscal year update successfully", url = "", id = model.rowid }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Something went wrong!!", url = "", id = 0 }, 0);
            }
        }

        public JsonResult ChartofAccountsdropdown(SearchModel model)
        {
            DataSet ds = BAL.AccountingRepository.ChartofAccountsdropdown();
            List<SelectListItem> productlist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                productlist.Add(new SelectListItem { Text = dr["label"].ToString(), Value = dr["ID"].ToString() });
            }
            return Json(productlist, JsonRequestBehavior.AllowGet);

        }

        public JsonResult ChartOfAccountBalanceList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = AccountingRepository.ChartOfAccountBalanceList(model.strValue3, model.strValue2, model.strValue1, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch (Exception ex) { throw ex; }
            return Json(result, 0);
            //return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }

        public JsonResult GetAccount()
        {
            DataTable dt = new DataTable();
            dt = BAL.AccountingRepository.GetAccount();
            List<SelectListItem> usertype = new List<SelectListItem>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                usertype.Add(new SelectListItem
                {
                    Value = dt.Rows[i]["account_number"].ToString(),
                    Text = dt.Rows[i]["label"].ToString()

                });
            }
            return Json(usertype, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetTotalAmountByID(OrderPostStatusModel model)
        {
            string JSONresult = string.Empty;
            try
            {

                DataTable dt = AccountingRepository.GetTotalAmountByID(model);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        [HttpPost]
        public JsonResult NewBankEntry(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {            
               JSONresult = JsonConvert.SerializeObject(AccountingRepository.NewBankEntry(model.strValue1, model.strValue2, model.strValue3, model.strValue4, model.strValue5, model.strValue6,model.SortCol, model.SortDir));
            }
            catch { }
            return Json(JSONresult, JsonRequestBehavior.AllowGet);
        }
        public JsonResult Banktransferlist(JqDataTableModel model)
        {
            string result = string.Empty;
            try
            { 
                DataTable dt = AccountingRepository.Banktransferlist(model.strValue1, model.strValue2);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            //  DataTable dt = AccountingRepository.GetAccountLedgerDetailsList(model.strValue1, model.strValue2, model.strValue3);
                 
            }
            catch (Exception ex) { throw ex; }
            return Json(result, 0);
        }
        public JsonResult GetEditDataID(OrderPostStatusModel model)
        {
            string JSONresult = string.Empty;
            try
            {

                DataTable dt = AccountingRepository.GetEditDataID(model);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        public JsonResult Banktransfergrandtotal(JqDataTableModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = AccountingRepository.Banktransfergrandtotal(model.strValue1, model.strValue2);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public JsonResult AddTranscationType(TranscationType model)
        {
            int ID = AccountingRepository.AddTranscationType(model);
            if(ID > 0)
            {
                return Json(new { status = true, message = "Transcation type saved successfully", url = "", id = ID }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Transcation type saved successfully", url = "", id = 0 }, 0);
            }
        }
        public JsonResult GetTranscationType(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = AccountingRepository.GetTransactionTypeList(model.strValue1, model.strValue2, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }

        public JsonResult TranscationTypeById(string strValue1)
        {
            string JSONResult = string.Empty;
            try
            {
                DataTable dt = AccountingRepository.TranscationTypeById(strValue1);
                JSONResult = JsonConvert.SerializeObject(dt);
            }
            catch(Exception ex) { throw ex; }
            return Json(JSONResult, 0);
        }
        public JsonResult UpdateTranscationType(TranscationType model)
        {
            if(model.rowid > 0)
            {
                AccountingRepository.UpdateTranscationType(model);
                return Json(new { status = true, message ="Transaction type update successfully.", url = "", id = model.rowid },0);
            }
            else
            {
                return Json(new { status = false, message ="Something went wrong.", url ="", id = 0 }, 0);
            }
        }
        public JsonResult GetAccountingAccount(SearchModel model)
        {
            DataSet ds = AccountingRepository.GetAccountingAccount();
            List<SelectListItem> productlist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                productlist.Add(new SelectListItem { Text = dr["label"].ToString(), Value = dr["ID"].ToString() });
            }
            return Json(productlist, JsonRequestBehavior.AllowGet);
        }
        public JsonResult AccountBalanceTotal(string strValue1)
        {
            string JSONResult = string.Empty;
            try
            {
                DataTable dt = AccountingRepository.AccountBalanceTotal(strValue1);
                JSONResult = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(JSONResult, 0);
        }      
        public JsonResult AccountName(string strValue1)
        {
            string JSONResult = string.Empty;
            try
            {
                DataTable dt = AccountingRepository.AccountName(strValue1);
                JSONResult = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(JSONResult, 0);
        }
        public JsonResult AccountReportList()
        {
            string JSONResult = string.Empty;
            try
            {
                DataTable dt = AccountingRepository.AccountReport();
                JSONResult = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(JSONResult, 0);
        }

        public JsonResult GetDataByID(OrderPostStatusModel model)
        {
            string JSONresult = string.Empty;
            try
            {

                DataTable dt = AccountingRepository.GetDataByID(model);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        [HttpGet]
        public JsonResult GetBankReconciliationprocess(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DateTime? fromdate = null; DateTime? todate = null;
                if (!string.IsNullOrEmpty(model.strValue1))
                    fromdate = Convert.ToDateTime(model.strValue1);
                if (!string.IsNullOrEmpty(model.strValue4))
                    todate = Convert.ToDateTime(model.strValue4);
                DataSet ds = new DataSet();
                ds = AccountingRepository.GetBankReconciliationprocess(fromdate, todate, model.strValue2, model.strValue5);

                JSONresult = JsonConvert.SerializeObject(ds);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        [HttpPost]
        public JsonResult Reconciliationprocess(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                long id = 0, u_id = 0;
                if (!string.IsNullOrEmpty(model.strValue1)) id = Convert.ToInt64(model.strValue1);
                // u_id = CommanUtilities.Provider.GetCurrent().UserID;
                System.Xml.XmlDocument orderXML = JsonConvert.DeserializeXmlNode("{\"Data\":" + model.strValue2 + "}", "Items");
                JSONresult = JsonConvert.SerializeObject(AccountingRepository.Reconciliationprocess(id, "I", orderXML));

            }
            catch { }
            return Json(JSONresult, JsonRequestBehavior.AllowGet);
        }
        public JsonResult AccountBalanceTotalBydate(string strValue1, string strValue2, string strValue3)
        {
            string JSONResult = string.Empty;
            try
            {
                DataTable dt = AccountingRepository.AccountBalanceTotalBydate(strValue1, strValue2, strValue3);
                JSONResult = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(JSONResult, 0);
        }

        [Route("accounting/trialbalance")]
        public ActionResult TrialBalance()
        {
            return View();
        }
        [HttpGet]
        [Route("accounting/get-trialbalance")]
        public JsonResult TrialBalanceList(AccountingReportSearchModal model)
        {
            string result = string.Empty;
            try
            {
                DataTable dt = AccountingRepository.GetTrailBalance(model.from_date, model.to_date, model.fiscalyear_id,"TRIALBAL");
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch (Exception ex) { throw ex; }
            return Json(result, 0);
        }
    }
}