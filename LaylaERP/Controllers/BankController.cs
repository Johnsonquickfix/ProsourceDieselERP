using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using LaylaERP.BAL;
using LaylaERP.Models;

namespace LaylaERP.Controllers
{
    public class BankController : Controller
    {
        // GET: Bank
        public ActionResult financialaccount()
        {
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
                    
                    int ID = BankRepository.AddBankAccount(model);
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
    }
}