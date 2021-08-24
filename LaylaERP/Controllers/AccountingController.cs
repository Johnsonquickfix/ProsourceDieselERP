﻿using LaylaERP.BAL;
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
        public JsonResult GetJournalData(AccountingJournalModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                string urid = "";
                if (model.user_status != "")
                    urid = model.user_status;
                string searchid = model.Search;
                DataTable dt = AccountingRepository.GetJournalData(urid, searchid, model.PageNo, model.PageSize, out TotalRecord, model.SortCol, model.SortDir);
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

        public JsonResult GetAccountSystem()
        {
            DataSet ds = AccountingRepository.GetAccountSystem();
            List<SelectListItem> accountsettinglist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {

                accountsettinglist.Add(new SelectListItem { Text = dr["pcg_version"].ToString(), Value = dr["version"].ToString() });

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
            string result = string.Empty;
            try
            {
                DataTable dt = AccountingRepository.GetProductStock(model.strValue1, model.strValue2, model.strValue3);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }
        public JsonResult GetNewAccounttoAssign(SearchModel model)
        {
            DataSet ds = BAL.AccountingRepository.GetNewAccounttoAssign();
            List<SelectListItem> productlist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                productlist.Add(new SelectListItem { Text = dr["label"].ToString(), Value = dr["ID"].ToString() });
            }
            return Json(productlist, JsonRequestBehavior.AllowGet);
        }
    }
}