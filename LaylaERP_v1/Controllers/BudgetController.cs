using LaylaERP.Models;
using LaylaERP.BAL;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

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
        public ActionResult AddBudget()
        {
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
                JSONresult = JsonConvert.SerializeObject(BudgetRepository.GetAccountBudget(model.fiscalyear_id, model.interval, model.fromdate, model.todate));
            }
            catch { }
            return Json(JSONresult, 0);
        }
    }
}