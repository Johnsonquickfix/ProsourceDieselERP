using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using LaylaERP.Models;
using LaylaERP.BAL;
using System.Data;
using Newtonsoft.Json;

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
        [HttpPost]
        public ActionResult StateRecycleTax(FeeNTax model)
        {
            FeeNTaxRepository FNT = new FeeNTaxRepository();
            //if (ModelState.IsValid)
            //{
            if (model.id > 0)
            {

                FNT.EditFeeNTaxStatus(model);
                return Json(new { status = true, message = "State Recycle Fee has been updated successfully!!", url = "" }, 0);
            }
            else
            {
                // int ID = Repo.AddNewCustomer(model);

                FNT.AddFeeNTax(model);
                ModelState.Clear();
                return Json(new { status = true, message = "State Recycle Fee has been saved successfully!!", url = "" }, 0);


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
                return Json(new { status = true, message = " State Recycle Fee has been updated successfully!!", url = "" }, 0);

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

    }
}

