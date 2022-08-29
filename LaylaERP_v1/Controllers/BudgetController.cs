using LaylaERP.Models;
using LaylaERP.BAL;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using LaylaERP.UTILITIES;

namespace LaylaERP.Controllers
{
    public class BudgetController : Controller
    {
        // GET: Budget List
        public ActionResult BudgetList()
        {
            return View();
        }
        // GET: Add/Edit Budget
        public ActionResult AddBudget(int id = 0, string qt = "m")
        {
            ViewBag.id = id; ViewBag.qt = qt;
            return View();
        }
        // GET: Budget Overview
        public ActionResult BudgetOverview(int id = 0)
        {
            ViewBag.id = id; 
            return View();
        }

        [HttpGet, Route("budget/get-fiscalyear")]
        public JsonResult GetFiscalYear(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                JSONresult = JsonConvert.SerializeObject(BudgetRepository.GetFiscalYear());
            }
            catch { }
            return Json(JSONresult, 0);
        }
        [HttpPost, Route("budget/get-accountbudget")]
        public JsonResult GetAccountBudget(BudgetModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                if (model.flag == "EDIT") { model.flag = "BUDGETDETAILS"; }
                else if (model.flag == "NEW") { model.flag = "ALLPLACC"; }
                JSONresult = JsonConvert.SerializeObject(BudgetRepository.GetAccountBudget(model.flag, model.budget_id, model.fiscalyear_id, model.interval, model.data_year));
            }
            catch { }
            return Json(JSONresult, 0);
        }
        [HttpGet, Route("budget/get-budgets")]
        public JsonResult GetBudgets(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                //UserActivityLog.WriteDbLog(LogType.Submit, "Budget List", "/Budget/BudgetList" + ", " + Net.BrowserInfo);

                result = JsonConvert.SerializeObject(BudgetRepository.GetBudgets(model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0), Formatting.Indented);
            }
            catch { }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, aaData = result }, 0);
        }
        [HttpPost, Route("budget/save-budget")]
        public JsonResult SaveBudget(BudgetModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                long user_id = CommanUtilities.Provider.GetCurrent().UserID;
                //if (model.budget_id > 0)
                //    UserActivityLog.WriteDbLog(LogType.Submit, "Update Budget id (" + model.budget_id + ")", "/Budget/AddBudget" + ", " + Net.BrowserInfo);
                //else
                //    UserActivityLog.WriteDbLog(LogType.Submit, "Add New Budget", "/Budget/AddBudget" + ", " + Net.BrowserInfo);

                JSONresult = JsonConvert.SerializeObject(BudgetRepository.SaveBudget("SAVEBUDGET", model.budget_id, user_id, model.budget_name));
            }
            catch { }
            return Json(JSONresult, 0);
        }
        [HttpPost, Route("budget/delete-budget")]
        public JsonResult DeleteBudget(BudgetModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                long user_id = CommanUtilities.Provider.GetCurrent().UserID;
                UserActivityLog.WriteDbLog(LogType.Submit, "Delete Budget id (" + model.budget_id + ") in budget list.", "/Budget/BudgetList" + ", " + Net.BrowserInfo);

                JSONresult = JsonConvert.SerializeObject(BudgetRepository.SaveBudget("DELETEBUDGET", 0, user_id, model.budget_name));
            }
            catch { }
            return Json(JSONresult, 0);
        }
    }
}