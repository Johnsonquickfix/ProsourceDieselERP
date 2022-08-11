using ClosedXML.Excel;
using LaylaERP.BAL;
using LaylaERP.Models;
using LaylaERP.UTILITIES;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
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
        public ActionResult journalvoucherlist()
        {
            return View();
        }
        public ActionResult journalvoucher()
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

        [HttpGet]
        public JsonResult JournalAccountList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DateTime? fromdate = null, todate = null;
                if (!string.IsNullOrEmpty(model.strValue2))
                    fromdate = Convert.ToDateTime(model.strValue2);
                if (!string.IsNullOrEmpty(model.strValue3))
                    todate = Convert.ToDateTime(model.strValue3);
                long aid = 0;
                if (!string.IsNullOrEmpty(model.strValue4))
                    aid = Convert.ToInt64(model.strValue4);
                //if (!string.IsNullOrEmpty(model.strValue5))
                //    vid = Convert.ToInt64(model.strValue5);

                DataTable dt = AccountingRepository.JournalAccountList(model.strValue1, fromdate, todate, aid, model.strValue5, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
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
            //return Json(new {  sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
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
        public JsonResult GetBankAccount()
        {
            DataTable dt = new DataTable();
            dt = BAL.AccountingRepository.GetBankAccount();
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
                DateTime? creationdate = null;
                if (!string.IsNullOrEmpty(model.strValue7))
                    creationdate = Convert.ToDateTime(model.strValue7);
                JSONresult = JsonConvert.SerializeObject(AccountingRepository.NewBankEntry(model.strValue1, model.strValue2, model.strValue3, model.strValue4, model.strValue5, model.strValue6, model.SortCol, model.SortDir, creationdate, model.strValue8));
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
            if (ID > 0)
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
            catch (Exception ex) { throw ex; }
            return Json(JSONResult, 0);
        }
        public JsonResult UpdateTranscationType(TranscationType model)
        {
            if (model.rowid > 0)
            {
                AccountingRepository.UpdateTranscationType(model);
                return Json(new { status = true, message = "Transaction type update successfully.", url = "", id = model.rowid }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Something went wrong.", url = "", id = 0 }, 0);
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

        #region [Expense Report]
        [HttpGet]
        public JsonResult GetBankReconciliationprocess(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DateTime? fromdate = null; DateTime? todate = null;
                if (!string.IsNullOrEmpty(model.strValue1))
                    fromdate = Convert.ToDateTime(model.strValue1);
                if (!string.IsNullOrEmpty(model.strValue2))
                    todate = Convert.ToDateTime(model.strValue2);
                DataSet ds = new DataSet();
                ds = AccountingRepository.GetBankReconciliationprocess(fromdate, todate, model.strValue3, model.strValue4);

                JSONresult = JsonConvert.SerializeObject(ds);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        [HttpPost]
        public JsonResult BankReconciliationUpdate(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                long id = 0; string flag = "";
                if (model.strValue1 == "TC") flag = "TRANCLEARED";
                else if (model.strValue1 == "BR") flag = "BANKRECONCILE";
                if (!string.IsNullOrEmpty(model.strValue2)) id = Convert.ToInt64(model.strValue2);

                JSONresult = JsonConvert.SerializeObject(AccountingRepository.BankReconciliationUpdate(flag, id, model.strValue3));
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
        #endregion

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
                if (string.IsNullOrEmpty(model.report_type)) model.report_type = "TRIALBAL";
                else if (model.report_type.Equals("PLREPORT")) model.report_type = "PROFITLOSS";
                else if (model.report_type.Equals("BSREPORT")) model.report_type = "BALANSHEET";
                else if (model.report_type.Equals("CFREPORT")) model.report_type = "CASHFLOW";
                DataTable dt = AccountingRepository.GetTrailBalance(model.from_date, model.to_date, model.fiscalyear_id, model.report_type);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch (Exception ex) { throw ex; }
            return Json(result, 0);
        }

        [HttpGet]
        [Route("accounting/AccountjournalvoucherList")]
        public JsonResult AccountjournalvoucherList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                int statusid = 0;
                DateTime? fromdate = null, todate = null;
                if (!string.IsNullOrEmpty(model.strValue1))
                    fromdate = Convert.ToDateTime(model.strValue1);
                if (!string.IsNullOrEmpty(model.strValue2))
                    todate = Convert.ToDateTime(model.strValue2);
                if (!string.IsNullOrEmpty(model.strValue3))
                    statusid = Convert.ToInt32(model.strValue3);
                DataTable dt = AccountingRepository.AccountjournalvoucherList(fromdate, todate, statusid, model.strValue4, model.strValue5, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }

        [HttpPost]
        public JsonResult Newvoucher(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                long id = 0, u_id = 0;
                if (!string.IsNullOrEmpty(model.strValue1)) id = Convert.ToInt64(model.strValue1);
                // u_id = CommanUtilities.Provider.GetCurrent().UserID;
                System.Xml.XmlDocument orderXML = JsonConvert.DeserializeXmlNode("{\"Data\":" + model.strValue2 + "}", "Items");
                System.Xml.XmlDocument orderdetailsXML = JsonConvert.DeserializeXmlNode("{\"Data\":" + model.strValue3 + "}", "Items");
                JSONresult = JsonConvert.SerializeObject(AccountingRepository.Newvoucher(id, "I", orderXML, orderdetailsXML));

            }
            catch { }
            return Json(JSONresult, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetvoucherDetailByID(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                long id = 0;
                if (!string.IsNullOrEmpty(model.strValue1))
                    id = Convert.ToInt64(model.strValue1);
                DataSet ds = AccountingRepository.GetvoucherDetailByID(id);
                JSONresult = JsonConvert.SerializeObject(ds);
            }
            catch { }
            return Json(JSONresult, 0);
        }


        [HttpPost]
        public ActionResult FileUploade(string Name, HttpPostedFileBase ImageFile)
        {
            try
            {

                if (ImageFile != null)
                {

                    ProductModel model = new ProductModel();
                    //Use Namespace called :  System.IO  
                    string FileName = Path.GetFileNameWithoutExtension(ImageFile.FileName);
                    FileName = System.Text.RegularExpressions.Regex.Replace(FileName, @"\s+", "");
                    //To Get File Extension  
                    long filesize = ImageFile.ContentLength / 1024;
                    string FileExtension = Path.GetExtension(ImageFile.FileName);

                    if (FileExtension == ".xlsx" || FileExtension == ".xls" || FileExtension == ".XLS" || FileExtension == ".pdf" || FileExtension == ".PDF" || FileExtension == ".doc" || FileExtension == ".docx" || FileExtension == ".png" || FileExtension == ".PNG" || FileExtension == ".jpg" || FileExtension == ".JPG" || FileExtension == ".jpeg" || FileExtension == ".JPEG" || FileExtension == ".bmp" || FileExtension == ".BMP")
                    {
                        //Add Current Date To Attached File Name  
                        //FileName = DateTime.Now.ToString("yyyyMMdd") + "-" + FileName.Trim() + FileExtension;

                        FileName = FileName.Trim() + FileExtension;
                        string FileNameForsave = FileName;


                        DataTable dt = AccountingRepository.GetfileCountdata(Convert.ToInt32(Name), FileName);
                        if (dt.Rows.Count > 0)
                        {
                            return Json(new { status = false, message = "File already uploaded", url = "" }, 0);
                        }
                        else
                        {

                            string UploadPath = Path.Combine(Server.MapPath("~/Content/journalvoucher"));
                            UploadPath = UploadPath + "\\";
                            //Its Create complete path to store in server.  
                            model.ImagePath = UploadPath + FileName;
                            //To copy and save file into server.  
                            ImageFile.SaveAs(model.ImagePath);
                            var ImagePath = "~/Content/journalvoucher/" + FileName;
                            int resultOne = AccountingRepository.FileUploade(Convert.ToInt32(Name), FileName, filesize.ToString(), FileExtension, ImagePath);

                            if (resultOne > 0)
                            {
                                return Json(new { status = true, message = "File upload successfully!!", url = "Manage" }, 0);
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
            catch (Exception ex)
            {
                return Json(new { status = false, message = "Invalid details", url = "" }, 0);
            }

        }

        public JsonResult Deletefileuploade(ProductModel model)
        {
            JsonResult result = new JsonResult();
            //DateTime dateinc = DateTime.Now;
            //DateTime dateinc = UTILITIES.CommonDate.CurrentDate();
            var resultOne = 0;
            // model.ID = model.strVal;
            if (model.ID > 0)
                resultOne = AccountingRepository.Deletefileuploade(model);
            if (resultOne > 0)
            {
                return Json(new { status = true, message = "deleted successfully!!", url = "Manage" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid details", url = "" }, 0);
            }
        }

        public JsonResult GetfileuploadData(SearchModel model)
        {
            List<ProductModelservices> obj = new List<ProductModelservices>();
            try
            {
                obj = AccountingRepository.GetfileuploadData(model.strValue1, model.strValue2);
            }
            catch { }
            return Json(obj, 0);
        }

        [Route("accounting/cash-flows-statement")]
        public ActionResult CashFlowsStatement()
        {
            return View();
        }

        [HttpPost, Route("accounting/profitloss-export")]
        public ActionResult ProfitLossReportExport(AccountingReportSearchModal model)
        {
            string fileName = "Profit_Loss_detail.xlsx";
            try
            {
                if (string.IsNullOrEmpty(model.report_type)) model.report_type = "TRIALBAL";
                else if (model.report_type.Equals("PLREPORT")) model.report_type = "PROFITLOSS";
                else if (model.report_type.Equals("PLDREPORT")) model.report_type = "PROFITLOSSDETAIL";
                else if (model.report_type.Equals("BSREPORT")) model.report_type = "BALANSHEET";
                else if (model.report_type.Equals("CFREPORT")) model.report_type = "CASHFLOW";
                DataTable dt = AccountingRepository.GetTrailBalance(model.from_date, model.to_date, model.fiscalyear_id, model.report_type);
                dt.TableName = "Profit_Loss";
                using (XLWorkbook wb = new XLWorkbook())
                {
                    //Add DataTable in worksheet  
                    //wb.Worksheets.Add(dt);
                    var ws = wb.Worksheets.Add("Profit_Loss");
                    ws.Style.Font.FontName = "Arial"; ws.Style.Font.FontSize = 8;

                    ws.Cell("A1").Value = CommanUtilities.Provider.GetCurrent().CompanyName;
                    ws.Cell("A1").Style.Font.Bold = true; ws.Cell("A1").Style.Font.FontSize = 14; ws.Cell("A1").Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                    ws.Range("A1:H1").Merge();
                    ws.Cell("A2").Value = "Profit and Loss Detail";
                    ws.Cell("A2").Style.Font.Bold = true; ws.Cell("A2").Style.Font.FontSize = 14; ws.Cell("A2").Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                    ws.Range("A2:H2").Merge();
                    ws.Cell("A3").Value = "";
                    ws.Cell("A3").Style.Font.Bold = true; ws.Cell("A3").Style.Font.FontSize = 10; ws.Cell("A3").Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                    ws.Range("A3:H3").Merge();

                    //Add header
                    ws.Range("A5:H5").Style.Font.Bold = true; ws.Range("A5:H5").Style.Font.FontSize = 9;
                    ws.Cell("A5").Value = "Account";
                    ws.Cell("B5").Value = "Date";
                    ws.Cell("C5").Value = "Transaction Type";
                    ws.Cell("D5").Value = "Num";
                    ws.Cell("E5").Value = "Name";
                    ws.Cell("F5").Value = "Memo/Description";
                    ws.Cell("G5").Value = "Amount";
                    ws.Cell("H5").Value = "Balance";
                    int i = 6;
                    foreach (DataRow dtRow in dt.Rows)
                    {
                        ws.Cell("A" + i).Value = dtRow["account_name"].ToString();
                        ws.Cell("B" + i).Value = dtRow["date"].ToString();
                        ws.Cell("C" + i).Value = dtRow["doc_type_desc"].ToString();
                        ws.Cell("D" + i).Value = dtRow["num"].ToString();
                        ws.Cell("E" + i).Value = dtRow["name"].ToString();
                        ws.Cell("F" + i).Value = dtRow["memo"].ToString();
                        ws.Cell("G" + i).Value = dtRow["amount"].ToString();
                        ws.Cell("H" + i).Value = dtRow["balance"].ToString();
                        i++;
                    }
                    ws.Columns().AdjustToContents();  // Adjust column width
                    ws.Rows().AdjustToContents();     // Adjust row heights
                    using (MemoryStream stream = new MemoryStream())
                    {
                        wb.SaveAs(stream);
                        return File(stream.ToArray(), "application/ms-excel", fileName);
                    }
                }
                //result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch (Exception ex) { throw ex; }
            //return Json(robj, JsonRequestBehavior.AllowGet);
        }

  

        [HttpGet]
        public JsonResult Getfillaccount()
        {
            string result = string.Empty;
            try
            {
                DataSet DS = AccountingRepository.Getfillaccount();
                result = JsonConvert.SerializeObject(DS, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }

        #region [Business Snapshot Report]
        [Route("accounting/business-snapshot-report")]
        public ActionResult BusinessSnapshotReport()
        {
            return View();
        }
        [HttpGet, Route("accounting/get-income-expence")]
        public JsonResult GetBusinessSnapshotReport(AccountingReportSearchModal model)
        {
            string result = string.Empty;
            try
            {
                if (model.report_type.Equals("IEREPORT")) model.report_type = "PROFITLOSS";
                else if (model.report_type.Equals("PYCOMPARISON")) model.report_type = "PYIEC";
                DataTable dt = AccountingRepository.GetBusinessSnapshotReport(model.from_date, model.to_date, model.fiscalyear_id, model.report_type);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch (Exception ex) { throw ex; }
            return Json(result, 0);
        }
        #endregion

        #region [Expense Report]
        [Route("accounting/expense-report")]
        public ActionResult ExpenseReport()
        {
            return View();
        }
        [HttpGet, Route("accounting/expense-list")]
        public JsonResult GetExpenseVoucherList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DateTime? fromdate = null, todate = null;
                if (!string.IsNullOrEmpty(model.strValue1)) fromdate = Convert.ToDateTime(model.strValue1);
                if (!string.IsNullOrEmpty(model.strValue2)) todate = Convert.ToDateTime(model.strValue2);

                DataTable dt = AccountingRepository.ExpenseVoucherList(fromdate, todate, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, aaData = result }, 0);
        }
        [HttpPost, Route("accounting/expense-list-export")]
        public FileResult ExpenseVoucherListExport(JqDataTableModel model)
        {
            //Name of File  
            //FileContentResult robj;
            string fileName = "Expense_Report_" + model.strValue1 + "_to_" + model.strValue2 + ".xlsx";
            try
            {
                int TotalRecord = 0;
                DateTime? fromdate = null, todate = null;
                if (!string.IsNullOrEmpty(model.strValue1)) fromdate = Convert.ToDateTime(model.strValue1);
                if (!string.IsNullOrEmpty(model.strValue2)) todate = Convert.ToDateTime(model.strValue2);

                DataTable dt = AccountingRepository.ExpenseVoucherList(fromdate, todate, model.sSearch, 0, 1000000, out TotalRecord, model.sSortColName, model.sSortDir_0);
                dt.TableName = "Expense_Report";
                using (XLWorkbook wb = new XLWorkbook())
                {
                    //Add DataTable in worksheet  
                    //wb.Worksheets.Add(dt);
                    var ws = wb.Worksheets.Add("Expense_Report");
                    ws.Style.Font.FontName = "Arial"; ws.Style.Font.FontSize = 8;

                    ws.Cell("A1").Value = CommanUtilities.Provider.GetCurrent().CompanyName;
                    ws.Cell("A1").Style.Font.Bold = true; ws.Cell("A1").Style.Font.FontSize = 14; ws.Cell("A1").Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                    ws.Range("A1:F1").Merge();
                    ws.Cell("A2").Value = "Expense Report";
                    ws.Cell("A2").Style.Font.Bold = true; ws.Cell("A2").Style.Font.FontSize = 14; ws.Cell("A2").Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                    ws.Range("A2:F2").Merge();
                    ws.Cell("A3").Value = "";
                    ws.Cell("A3").Style.Font.Bold = true; ws.Cell("A3").Style.Font.FontSize = 10; ws.Cell("A3").Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                    ws.Range("A3:F3").Merge();

                    //Add header
                    ws.Range("A5:H5").Style.Font.Bold = true; ws.Range("A5:H5").Style.Font.FontSize = 9;
                    ws.Cell("A5").Value = "";
                    ws.Cell("B5").Value = "Transaction date";
                    ws.Cell("C5").Value = "Transaction type";
                    ws.Cell("D5").Value = "Transaction number";
                    ws.Cell("E5").Value = "Vendor name";
                    ws.Cell("F5").Value = "Amount";
                    int i = 6;
                    foreach (DataRow dtRow in dt.Rows)
                    {
                        ws.Cell("A" + i).Value = i - 5;
                        ws.Cell("B" + i).Value = dtRow["doc_date"].ToString(); ws.Cell("C" + i).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Left);
                        ws.Cell("C" + i).Value = dtRow["doc_type_desc"].ToString(); ws.Cell("C" + i).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Left);
                        ws.Cell("D" + i).Value = dtRow["PO_SO_ref"].ToString(); ws.Cell("C" + i).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Left);
                        ws.Cell("E" + i).Value = dtRow["subledger_label"].ToString();
                        ws.Cell("F" + i).Value = dtRow["amount"].ToString();
                        i++;
                    }
                    ws.Columns().AdjustToContents();  // Adjust column width
                    ws.Rows().AdjustToContents();     // Adjust row heights
                    using (MemoryStream stream = new MemoryStream())
                    {
                        //wb.SaveAs(stream);
                        //var bytesdata = File(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
                        //robj = bytesdata;
                        //Return xlsx Excel File  
                        //return File(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);

                        wb.SaveAs(stream);
                        return File(stream.ToArray(), "application/ms-excel", fileName);
                    }
                }
                //result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch (Exception ex) { throw ex; }
            //return Json(robj, JsonRequestBehavior.AllowGet);
        }
        #endregion

        [HttpPost, Route("accounting/Journal-export")]
        public ActionResult JournalReportExport(AccountingReportJournalSearchModal model)
        {
            string fileName = "Journal_detail.xlsx";
            try
            {
                //if (string.IsNullOrEmpty(model.report_type)) model.report_type = "JOURNAL";
                //else if (model.report_type.Equals("JOURNAL")) model.report_type = "PROFITLOSS";              
                DataTable dt = AccountingRepository.GetjournalDetails(model.from_date, model.to_date, model.vendor, model.report_type, model.account,model.filter);
                dt.TableName = "Journal_export";
                using (XLWorkbook wb = new XLWorkbook())
                {
                    //Add DataTable in worksheet  
                    //wb.Worksheets.Add(dt);
                    var ws = wb.Worksheets.Add("Journal_export");
                    ws.Style.Font.FontName = "Arial"; ws.Style.Font.FontSize = 8;

                    ws.Cell("A1").Value = CommanUtilities.Provider.GetCurrent().CompanyName;
                    ws.Cell("A1").Style.Font.Bold = true; ws.Cell("A1").Style.Font.FontSize = 14; ws.Cell("A1").Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                    ws.Range("A1:H1").Merge();
                    ws.Cell("A2").Value = "Journals Detail";
                    ws.Cell("A2").Style.Font.Bold = true; ws.Cell("A2").Style.Font.FontSize = 14; ws.Cell("A2").Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                    ws.Range("A2:H2").Merge();
                    ws.Cell("A3").Value = "";
                    ws.Cell("A3").Style.Font.Bold = true; ws.Cell("A3").Style.Font.FontSize = 10; ws.Cell("A3").Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                    ws.Range("A3:H3").Merge();

                    //Add header
                    ws.Range("A5:H5").Style.Font.Bold = true; ws.Range("A5:H5").Style.Font.FontSize = 9;
                    ws.Cell("A5").Value = "Date";
                    ws.Cell("B5").Value = "Journal";
                    ws.Cell("C5").Value = "Accounting Doc";
                    ws.Cell("D5").Value = "Label";
                    ws.Cell("E5").Value = "Operation Label";
                    ws.Cell("F5").Value = "Account";
                    ws.Cell("G5").Value = "Debit($)";
                    ws.Cell("H5").Value = "Credit($)";
                    int i = 6;
                    foreach (DataRow dtRow in dt.Rows)
                    {
                        ws.Cell("A" + i).Value = dtRow["datesort"].ToString();
                        ws.Cell("B" + i).Value = dtRow["label_name"].ToString();
                        ws.Cell("C" + i).Value = dtRow["PO_SO_ref"].ToString();
                        ws.Cell("D" + i).Value = dtRow["subledger_label"].ToString();
                        ws.Cell("E" + i).Value = dtRow["label_operation"].ToString();
                        ws.Cell("F" + i).Value = dtRow["label"].ToString();
                        ws.Cell("G" + i).Value = dtRow["debit"].ToString();
                        ws.Cell("H" + i).Value = dtRow["credit"].ToString();
                        i++;
                    }
                    ws.Columns().AdjustToContents();  // Adjust column width
                    ws.Rows().AdjustToContents();     // Adjust row heights
                    using (MemoryStream stream = new MemoryStream())
                    {
                        wb.SaveAs(stream);
                        return File(stream.ToArray(), "application/ms-excel", fileName);
                    }
                }
                //result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch (Exception ex) { throw ex; }
            //return Json(robj, JsonRequestBehavior.AllowGet);
        }

        [HttpPost, Route("accounting/ChartOffAcount-export")]
        public ActionResult ChartOffAcountReportExport(AccountingReportJournalSearchModal model)
        {
            string fileName = "Chart_of_accounts_detail.xlsx";
            try
            {
                //if (string.IsNullOrEmpty(model.report_type)) model.report_type = "JOURNAL";
                //else if (model.report_type.Equals("JOURNAL")) model.report_type = "PROFITLOSS";              
                DataTable dt = AccountingRepository.GetjournalDetails(model.from_date, model.to_date, model.vendor, model.report_type, model.account, model.filter);
                dt.TableName = "Chart_of_accounts_detail_export";
                using (XLWorkbook wb = new XLWorkbook())
                {
                    //Add DataTable in worksheet  
                    //wb.Worksheets.Add(dt);
                    var ws = wb.Worksheets.Add("Chart_of_accounts_detail_export");
                    ws.Style.Font.FontName = "Arial"; ws.Style.Font.FontSize = 8;

                    ws.Cell("A1").Value = CommanUtilities.Provider.GetCurrent().CompanyName;
                    ws.Cell("A1").Style.Font.Bold = true; ws.Cell("A1").Style.Font.FontSize = 14; ws.Cell("A1").Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                    ws.Range("A1:H1").Merge();
                    ws.Cell("A2").Value = "Chart of accounts detail Detail";
                    ws.Cell("A2").Style.Font.Bold = true; ws.Cell("A2").Style.Font.FontSize = 14; ws.Cell("A2").Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                    ws.Range("A2:H2").Merge();
                    ws.Cell("A3").Value = "";
                    ws.Cell("A3").Style.Font.Bold = true; ws.Cell("A3").Style.Font.FontSize = 10; ws.Cell("A3").Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                    ws.Range("A3:H3").Merge();

                    //Add header
                    ws.Range("A5:H5").Style.Font.Bold = true; ws.Range("A5:H5").Style.Font.FontSize = 9;
                    ws.Cell("A5").Value = "Date";
                    ws.Cell("B5").Value = "Journal";
                    ws.Cell("C5").Value = "Accounting Doc";
                    ws.Cell("D5").Value = "Label";
                    ws.Cell("E5").Value = "Operation Label";
                    ws.Cell("F5").Value = "Account";
                    ws.Cell("G5").Value = "Debit($)";
                    ws.Cell("H5").Value = "Credit($)";
                    int i = 6;
                    foreach (DataRow dtRow in dt.Rows)
                    {
                        ws.Cell("A" + i).Value = dtRow["datesort"].ToString();
                        ws.Cell("B" + i).Value = dtRow["label_name"].ToString();
                        ws.Cell("C" + i).Value = dtRow["PO_SO_ref"].ToString();
                        ws.Cell("D" + i).Value = dtRow["subledger_label"].ToString();
                        ws.Cell("E" + i).Value = dtRow["label_operation"].ToString();
                        ws.Cell("F" + i).Value = dtRow["label"].ToString();
                        ws.Cell("G" + i).Value = dtRow["debit"].ToString();
                        ws.Cell("H" + i).Value = dtRow["credit"].ToString();
                        i++;
                    }
                    ws.Columns().AdjustToContents();  // Adjust column width
                    ws.Rows().AdjustToContents();     // Adjust row heights
                    using (MemoryStream stream = new MemoryStream())
                    {
                        wb.SaveAs(stream);
                        return File(stream.ToArray(), "application/ms-excel", fileName);
                    }
                }
                //result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch (Exception ex) { throw ex; }
            //return Json(robj, JsonRequestBehavior.AllowGet);
        }
    }
}