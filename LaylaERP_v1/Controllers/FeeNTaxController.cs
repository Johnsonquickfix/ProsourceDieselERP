using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using LaylaERP.Models;
using LaylaERP.BAL;
using System.Data;
using Newtonsoft.Json;
using LaylaERP.UTILITIES;

namespace LaylaERP.Controllers
{
    public class FeeNTaxController : Controller
    {
        // GET: FeeNTax
        public ActionResult Index()
        {
            return View("StateRecycleTax");
        }
        [HttpGet]
        //public ActionResult StateRecycleTax(long id = 0)
        //{
        //    FeeNTax model = new FeeNTax();
        //    ViewBag.id = id;
        //    return View(model);
        //}

        public ActionResult CreateNew(long id = 0)
        {
            FeeNTax model = new FeeNTax();
            ViewBag.id = id;
            return View(model);
        }
        public ActionResult AddFee()
        {
            return View();
        }

        [HttpPost]
        public ActionResult StateRecycleTax(FeeNTax model)
        {
            FeeNTaxRepository FNT = new FeeNTaxRepository();
            //if (ModelState.IsValid)
            //{
            if (model.id > 0)
            {
                UserActivityLog.WriteDbLog(LogType.Submit, "Edit state recycle tax", "/FeeNTax/CreateNew/"+ model.id + "" + ", " + Net.BrowserInfo);
                FNT.EditFeeNTaxStatus(model);
                return Json(new { status = true, message = "State recycle fee updated successfully!!", url = "" }, 0);
            }
            else
            {
                // int ID = Repo.AddNewCustomer(model);
                UserActivityLog.WriteDbLog(LogType.Submit, "Save state recycle tax", "/FeeNTax/CreateNew" + ", " + Net.BrowserInfo);

                FNT.AddFeeNTax(model);
                ModelState.Clear();
                return Json(new { status = true, message = "State recycle fee saved successfully!!", url = "" }, 0);


            }
            //}
            //return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
        }

        public JsonResult GetFeeNTaxByID(FeeNTax model)
        {
            string JSONresult = string.Empty;
            try
            {

                DataTable dt = FeeNTaxRepository.FeeNTaxByID(model);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        public JsonResult UpdateFeeNTax(FeeNTax model)
        {
            FeeNTaxRepository FNT = new FeeNTaxRepository();

            if (ModelState.IsValid)
            {

                FNT.EditFeeNTaxStatus(model);
                return Json(new { status = true, message = " State recycle fee updated successfully!!", url = "" }, 0);

            }
            return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
        }

        [HttpPost]
        public JsonResult Getproduct(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable DT = BAL.FeeNTaxRepository.Getproduct(model.strValue1);
                JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        
        [HttpGet]
        public JsonResult GetFeeNTaxList(string status)
        {
            FeeNTaxRepository.GetFeeNTaxList(status);
            return Json(new { data = FeeNTaxRepository.FeeNTaxlist }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetState(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable DT = FeeNTaxRepository.GetState(model.strValue1, model.strValue2);
                JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public JsonResult GetParentproduct()
        {
            DataSet ds = FeeNTaxRepository.GetParentProduct();
            List<SelectListItem> vendorlist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                vendorlist.Add(new SelectListItem { Text = dr["post_title"].ToString(), Value = dr["ID"].ToString() });
            }
            return Json(vendorlist, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetCity(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable DT = FeeNTaxRepository.GetCity(model.strValue1);
                JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        [HttpPost]
        public JsonResult AddFee(Fee model)
        {
            try
            {
                int ID = FeeNTaxRepository.AddFee(model);
                if (ID > 0)
                {
                    return Json(new { status = true, message = "Fee saved successfully.", url = "", id = ID }, 0);
                }
                else
                {
                    return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
                }
            }
            catch (Exception ex) { return Json(new { status = false, message = ex.Message, url = "" }, 0); }
        }

        public JsonResult GetFeeList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = FeeNTaxRepository.GetFeeList(model.strValue1, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }
        [HttpPost]
        public JsonResult EditFee(Fee model)
        {
            try
            {
                if (model.rowid > 0)
                {
                    FeeNTaxRepository.EditFee(model);
                    return Json(new { status = true, message = "Fee update successfully.", url = "", id = 0 }, 0);
                }
                else
                {
                    return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
                }
            }
            catch (Exception ex) { return Json(new { status = false, message = ex.Message, url = "" }, 0); }
        }
        [HttpPost]
        public JsonResult SelectFee(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable DT = FeeNTaxRepository.SelectFee(model.strValue1);
                JSONresult = JsonConvert.SerializeObject(DT, Formatting.Indented);
            }
            catch { }
            return Json(JSONresult, 0);
        }
    }
}

